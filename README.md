# Angular parte IV

Es normal que un sitio web tenga mas de una pagina web. Cada una de estas tendran una ruta o endpoint. Para hacer esto en ruta primero vamos a crear componentes para cada ruta.

    ng g c pages/home
    ng g c pages/notFound
    ng g c pages/category
    ng g c pages/mycart
    ng g c pages/login
    ng g c pages/register
    ng g c pages/recovery
    ng g c pages/profile

Agregados todos los componentes, vamos a crear un array con todas estas nuevas rutas en nuestro archivo arr-routing.module.ts

    const routes: Routes = [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'category',
        component: CategoryComponent
      },
      ...
      ]

Despues de completar nuestro array de rutas, agregaremos la siguiente linea a nuestro html de app.componente y migraremos app-products al componente home.

    <router-outlet></router-outlet>

Ahora podemos correr la aplicacion y escribir en nuestro navegador la ruta manual y obtendremos las distintas paginas que creamos.

La forma especialmente simple de Angular para crear rutas, nos ahorra tiempo y esfuerzo, pero ahora que hemos creado esta rutas se nos presenta un problema. hemos delegado toda la logica a una simple page y tenemos que comenzar a migrar toda la logica, sus complenentes y librerias a sus respectivos componentes.

**home**

    import { Component } from '@angular/core';
    import { ProductsService } from '../../services/products.service'
    import { Product } from './../../models/product.model';

    @Component({
      selector: 'app-home',
      templateUrl: './home.component.html',
      styleUrls: ['./home.component.scss']
    })
    export class HomeComponent {

      limit = 10;
      offset = 0;
      products: Product[] = [];

      constructor(private producServices: ProductsService) { }

      ngOnInit(): void {
        this.producServices.getProductsByPages(this.offset, this.limit)
          .subscribe(res => {
            this.products = res;
          });
      }

      OnLoadMore() {
        this.producServices.getProductsByPages(this.offset, this.limit)
          .subscribe(res => {
            this.products = this.products.concat(res);
            console.log(this.products)
            this.offset += 10;
          });
      }
    }

**Html**

    <app-products [products]="products" (loadMore)="OnLoadMore()"></app-products>

>Nota: Para no hacer mas largo de lo que se puede, eliminar las partes que acabamos de migrar de produts a home sera el reto para ustedes. Lo que si se pondra son los cambios que tendremos al llamar a la funcion loadMore desde home

**products.ts**

    export class ProductsComponent {
      @Output() loadMore = new EventEmitter();
      ...

        OnLoadMore() {
        this.loadMore.emit()
      }
    }

**html**

    <div class="products--grid">
      <app-product [product]="product" *ngFor="let product of products" (addedProduct)="onAddToShoppingCart($event)"
        (ShowProduct)="OnShowDetail($event)"></app-product>
    </div>

Si nosotros quisieramos hacer uso del componente category, pordriamos llamar a los productois de determinada categoria

    import { Component, OnInit } from '@angular/core';
    import { ActivatedRoute } from '@angular/router';

    import { Product } from '../../models/product.model';
    import { ProductsService } from './../../services/products.service';

    @Component({
      selector: 'app-category',
      templateUrl: './category.component.html',
      styleUrls: ['./category.component.scss']
    })
    export class CategoryComponent {

      categoryId: string | null = null;
      limit = 10;
      offset = 0;
      products: Product[] = [];

      constructor(
        private route: ActivatedRoute,
        private productsService: ProductsService
      ) { }

      ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
          this.categoryId = params.get('id');
          if (this.categoryId) {
            this.productsService.getByCategory(this.categoryId, this.limit, this.offset)
              .subscribe(data => {
                this.products = data;
              })
          }
        });
      }
    }

De esa manera en el html no cambiariamos la logica

    <app-products [products]="products"></app-products>

La Api tiene su seccion de categorias que tiene 5 formas diferentes para ello, solo tenemos que acceder al enpoind.


    export class ProductsService {

      urlApi = `${environment.API_URL}/api`
      ...
        getByCategory(categoryId: string, limit?: number, offset?: number) {
          let params = new HttpParams();
          if (limit && offset != null) {
            params = params.set('limit', limit);
            params = params.set('offset', offset);
          }
          return this.http.get<Product[]>(`${this.urlApi}/categories/${categoryId}/products`, { params })
        }
    }

Claro que todavia tendriamos que agregar la paginacion, pero ya se ha hablado sobre el tema por lo que deberias ser capaz de hacerlo por tu cuenta.

## RouterLink y RouterActive

No es buena práctica realizar una redirección a otra ruta utilizando un simple href, ya que el mismo genera que se recargue toda la página y vuelva a renderizarse los componentes.
Angular posee una alternativa para evitar el redireccionamiento utilizando la directiva routerLink.

    <header class="header">
      <div class="d-flex-mobile">
        <a routerLink="home" class="logo">CompanyLogo</a>
        <div class="show-side-menu">
          <app-side-menu></app-side-menu>
        </div>
      </div>
      <div class="header-right hidde-menu">
        <div class="menuCategoria" *ngFor="let item of categories">
          <a routerLinkActive="active" [routerLink]="['/category', item.id]">{{ item.name }}</a>
        </div>
        <a href="#">Carrito <span>{{counter}}</span></a>
      </div>
    </header>

Para hacer que esto funcione, creamos un nueov servicio llamado categoria que obtendria los id y los nombres de todas las categorias de la api.

    import { Injectable } from '@angular/core';
    import { HttpClient, HttpParams } from '@angular/common/http';

    import { Category } from '../models/product.model';
    import { environment } from 'src/environments/environments';

    @Injectable({
      providedIn: 'root'
    })
    export class CategoriesService {

      private apiUrl = `${environment.API_URL}/api/categories`;

      constructor(
        private http: HttpClient
      ) { }

      getAll(limit?: number, offset?: number) {
        let params = new HttpParams();
        if (limit && offset) {
          params = params.set('limit', limit);
          params = params.set('offset', limit);
        }
        return this.http.get<Category[]>(this.apiUrl, { params });
      }
    }

Luego intectamos esto en nuestro componente nav

    export class NavComponent {

      counter = 0;
      categories: Category[] = [];

      constructor(
        private storeService: StoreService,
        private categoriesService: CategoriesService
      ) { }

      ngOnInit(): void {
        this.storeService.myCart$.subscribe(products => {
          this.counter = products.length;
        })
        this.getAllCategories();
      }

      getAllCategories() {
        this.categoriesService.getAll()
          .subscribe(data => {
            this.categories = data;
          });
      }

    }

y iteramos el array obtenido para crear un menu de manera dinamica. Para mejorar la experiencia del usuario utilizando la aplicación, es buena práctica resaltar con algún estilo CSS particular la ruta activada en el momento. Angular hace esto por nosotros gracias a la directiva routerLinkActive.

Cuando Angular identifique que la misma ruta del enlace está activa, le agregará la clase active. Ya luego es tarea de darle estilos a esta clase para que luzca diferente con respecto a las rutas desactivadas.

>nota: queda la implementacion del side-menu a ustedes.

Se lo que estas pensando, como implementar una ruta 404. Bueno eso es bastante sensillo, solo tenemos que agregar la siguiente linea para en nuestro array de rutas.

const routes: Routes = [
  ...
  , {
    path: '**',
    component: NotFoundComponent
  }
];

Ahora vamos a crear una manera interaccion entre las imagenes y l producto. permitiendo que al hacer click podamos ir al producto deseado con router link. Para ello vamos a crear un nueva pagina

    $ ng g c pages/product-detail

>nota: como todo son temas que ya fueron tratados no vamos a entrar en detalles.

    import { Component, OnInit } from '@angular/core';
    import { Location } from '@angular/common';
    import { ActivatedRoute } from '@angular/router';
    import { Product } from 'src/app/models/product.model';
    import { ProductsService } from 'src/app/services/products.service';


    @Component({
      selector: 'app-product-detail',
      templateUrl: './product-detail.component.html',
      styleUrls: ['./product-detail.component.scss']
    })
    export class ProductDetailComponent implements OnInit {

      productId: string | null = null;
      product: Product | null = null;

      constructor(
        private route: ActivatedRoute,
        private producServices: ProductsService,
        private location: Location
      ) { }

      ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
          this.productId = params.get('id');
          if (this.productId) {
            return this.producServices.getAllProductById(this.productId)
              .subscribe(data => {
                console.log(data)
                this.product = data
              })
          }
          return [null]
        })

      }


      goToBack() {
        this.location.back();
      }
    }

Aqui vemos una funcion nueva llamada goToBack que como su nombre lo indica usa la libreria location para volver un paso atras en el historial web.
 
    <div class="page-product">
      <button (click)="goToBack()">Back</button>
      <div class="detail" *ngIf="product">
        <div class="gallery">
          <swiper-container #swiper initial-slide="0" pagination="true" slides-per-view="1">
            <swiper-slide *ngFor="let img of product?.images">
              <img [src]="img" width="100%" alt="{{ product.title }}" />
            </swiper-slide>
          </swiper-container>
        </div>
        <div>
          <h1>{{ product.title }}</h1>
          <h2>{{ product.price | currency }}</h2>
          <p>{{ product.description }}</p>
        </div>
      </div>
    </div>

**css**

    .page-product {
      padding: 0 3em;

      .detail {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 20px;

        .gallery {
          overflow: hidden;
          width: 100%;
        }

        h2,
        h1 {
          margin-bottom: 5px;
          font-weight: bold;
          font-size: 2em;
        }

        h2 {
          font-size: 1.5em;
        }
      }
    }

Con esto la pagina nueva que captura el producto de acuerdo al id deveria estar lista. podemos agregar la nueva pagina al array de rutas y luego llamarlo con routerLink.

**Product.componente.html**

    <a [routerLink]="['/product', product.id]">
      <img width="200px" *ngIf="product.images.length > 0" [src]="product.images[0]" alt="">
    </a>

Ya que estamos en esto modifiquemos la funcion de ver detalles que creamos, Pero esta vez en ves de usar parametros normales usaremos Quert Params. ¿cual es la diferencia?

Los parámetros de ruta, por ejemplo /catalogo/:categoryId, son obligatorios. Sin el ID la ruta no funcionaría. Por otro lado, existen los parámetros de consulta que los reconocerás seguidos de un ? y separados por un &, por ejemplo /catalogo?limit=10&offset=0.

En home llamaremos a otra liberia.

    import { ActivatedRoute } from '@angular/router';

    export class HomeComponent {

      ...
      productId: string | null = null

      constructor(
        private producServices: ProductsService,
        private route: ActivatedRoute) { }.
      
       ngOnInit(): void {
        this.producServices.getProductsByPages(this.offset, this.limit)
          .subscribe(res => {
            this.products = res;
          });
        this.route.queryParamMap.subscribe(params => {
          this.productId = params.get('product')
        })
      }
    }

Con esto estaremos recogiendo el parametro url, cuando en la url se le agregue el nombre de ?product=...

**html**

    <app-products [productId]="productId" [products]="products" (loadMore)="OnLoadMore()"></app-products>


Luego vamos a ts de productos para modificar la funcion onShoewDetail

    export class ProductsComponent {

    @Input() set productId(id: string | null) {
        if (id) {
          this.OnShowDetail(id)
        }
      }


    OnShowDetail(id: string) {

        if (!this.showProduct) {
          this.showProduct = true
        }
        this.producServices.getAllProductById(id).subscribe(
          data => {
            //this.toggleProduct();
            this.producChosen = data
          }, error => {
            console.log(error);
          })
      }
    }

Con el Set estaremos pendiente de si el id cambia. y controlaremos si el showProduct esta verdarero o falso

Luego vamos al Html donde renderizamos cada producto y cambiamos el boton de ver detalles por una etiqueta "a"

    <a routerLink="." [queryParams]="{product : product.id}">Ver detalle</a>

Con esto en la pagina que estemos siempre que se detecte la palabra clave de nuestro param query, se agregara y mientras este la funcion se mostrara la pestaña de detalles.

>nota: la pagina de categoria no posee la fucion OnshowDetalle, por lo que queta como reto implementarla y probar lo que digo.


## La programación modular

La programación modular es un paradigma de programación que consiste en dividir un programa en módulos o subprogramas con el fin de hacerlo más legible y manejable.

Podemos identificar varios tipos de módulos. El AppModule es el módulo raíz que da inicio a tu aplicación. Existen los Routing Modules para la definición de rutas.

El Shared Module que posee servicios o componentes compartidos por toda la aplicación. El Feature/Domain Module que son módulos propios de tu aplicación.

De esta manera, Angular construye un ecosistema de módulos, pudiendo dividir una APP en N partes para optimizar el rendimiento y mantener un orden en el código fuente para que sea comprensible y escalable.

Vamos a trabajar con los modulos de dos maneras. primero de manera manual y segundo usando comando que angular nos proporciona.

Comencemos creando una nueva carpeta llamada webSite, luego vamos a arrastrar las carpetas de uso general a esta nueva carpeta. Estas carpetas son aquellas que no son usadas de manera global como Component, Page, Pipe o directivas si las tenemos.

Despues de mover estas carpetas, tendremos problemas con las importaciones. por lo que tendremos que correr el archivo para ver claramente donde tenemos que hacer los cambios.

>Nota: en algunos casos puede suceder que a pesar de que los se aplicaron los cambios, los errores persiten en vsc por lo que se recomienda cercar el programa y volverlo a abrir.

Terminado el proceso, podemos comenzar a crear un nuevo componente llamado layout.

    ng g c webSite/components/layout

En el agregaremos nuestro header para nuestro nav solo sea visibles a las paginas correspondiente a este "modulo". Para ello vamos a copiar el contenido de nuestro app.component.html a nuestro layout

    <app-nav></app-nav>
    <router-outlet></router-outlet>

Luego borramos el app-nav del app.component y vamos a app-routin para hacer los cambios faltantes.

    const routes: Routes = [
      {
        path: '',
        component: LayoutComponent,
        children: [
          {
            path: '',
            redirectTo: '/home',
            pathMatch: 'full'
          },
          {
            path: 'home',
            component: HomeComponent
          },
          {
            path: 'category/:id',
            component: CategoryComponent
          },
          {
            path: 'product/:id',
            component: ProductDetailComponent
          },
          ...
          ]
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ];

Con esta nueva propiedad vamos a decir que nuestro modulo tiene direcciones, tiene "direcciones internas" que pertenecen al primer modulo que creamos. 

Con el segundo lo crearemos desde la terminal.

    ng g m cms --routing

Creadp el modulo creemos algunos componentes en el.

    ng g c cms/pages/tasks
    ng g c cms/pages/grid
    ng g c cms/components/layout

Ahora si vamos a nuestro cms.module, veremos que los componentes creados del modulo cms, ya que pertenecen unicamente a esta seccion. Tmabien, en el archivo de rutas vemos que tiene un metodo llamado "forChild"

Le demos un estilo simple a nuestro nuevo layout para poder visualizar el ejmeplo.

    <div>
      <header>
        <h3>Title</h3>
      </header>
      <nav>
        <ul>
          <li><a routerLink="grid">Grid Page</a></li>
          <li><a routerLink="tasks">Tasks Page</a></li>
        </ul>
      </nav>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>

***css***

    div {
      display: grid;
      height: 100vh;
      grid-template-columns: 220px 1fr;
      grid-template-rows: auto 1fr;
      grid-template-areas:
        "header header header"
        "nav content content";

      header {
        grid-area: header;
        background-color: #3E51B5;
        color: white;
        padding: 1em;
        box-shadow: 1px 2px 4px 0 rgb(21 99 157 / 16%);
        border-bottom: 1px solid rgba(21, 99, 157, 0.16);
      }

      nav {
        grid-area: nav;
        border-right: 1px solid rgba(21, 99, 157, 0.16);
        background-color: #fff;

        a {
          margin: 0;
          padding: 0;
          padding: 1em;
          cursor: pointer;
          position: relative;
          display: block;
          text-decoration: none;
          color: #000;
        }
      }

      main {
        grid-area: content;
        background-color: #f3f8fb;
        padding: 1em;
      }
    }

Luego en el archivo de rutas importamos lo componentes y creamos el array con las rutas.

    const routes: Routes = [
      {
        path: '',
        component: LayoutComponent,
        children: [{
          path: '',
          redirectTo: 'grid',
          pathMatch: 'full'
        },
        {
          path: 'grid',
          component: GridComponent
        },
        {
          path: 'tasks',
          component: TasksComponent
        }
        ]
      }
    ];

y por ultimo en el router de nuestro modulo principal app llamamos a nuestro el router hijo.

    const routes: Routes = [
      {
        path: '',
        component: LayoutComponent,
        children: [
          {
            ....
          }]
      },
      {
        path: 'cms',
        loadChildren: () => import('./cms/cms.module').then(m => m.CmsModule)
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ];

Con esto si vamos a localhost{puerto}/cms veremos un nuevo modulo que independiente del anterior. Gracias a las rutas anidadas cada modulo puede tener su propio layout con formatos diferentes.


## Shared Module

La documentación oficial de Angular recomienda la creación de un SharedModule. Un módulo compartido donde guardarás los componentes, pipes, directivas o servicios que dos o más de tus otros módulos necesitarán.

Importa en este módulo las piezas de código que serán utilizadas por tus otros módulos como, por ejemplo, un servicio para consumo de APIs o un componente para construir un paginador. Pipes y Directivas customizadas también es buena práctica colocarlas aquí.

Para nusetro trabajo ahora mismo crearemos una carpeta llamada components dentro de nuestro nuevo modulo y moveremos las carpetas de products, porduct y img si es que lo usaste.

Luego vamos al archivo shared y decharamos las importaciones e indicamos que componentes vamos a exportar.

    import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';

    import { ImgComponent } from './components/img/img.component';
    import { ProductComponent } from './components/product/product.component';
    import { ProductsComponent } from './components/products/products.component';

    @NgModule({
      declarations: [
        ImgComponent,
        ProductComponent,
        ProductsComponent,
      ],
      imports: [
        CommonModule
      ],
      exports:[
        ImgComponent,
        ProductComponent,
        ProductsComponent,
      ]
    })
    export class SharedModule { }

No nos olvidamos de importar este nuevo modulo en nuestros modulos que vamos a usar. En este ejemplo solo mostrare en app.module.


    import { SharedModule } from './shared/shared.module';
    ...

    @NgModule({
     declarations: [
      ...
      ],
      imports: [
        ...
        SharedModule
      ],
      providers: [{
        ...
      },
      {
        ...
      }],
      ...
    })
    export class AppModule { }

Y comencemos a hacer los cambios para que los componentes que movimos puedan funcionar con normalidad.


## Precarga de módulos

Modularizar una aplicación nos beneficia en rendimiento gracias a las técnicas de Lazy Loading y CodeSplitting pero… ¿Funciona realmente? ¿El rendimiento de mi app será el óptimo?

Es muy bueno hacer eso de estas dos tecnicas por que nos reduce la carga inicial, pero se prensenta un inconveniente cuando tenemos problemas de red o redes lentas. ya que al modularizarlas, hace que cada uno de los modulos pace por la etapa inicial (descarga, parse, compile, execute)

Con angular podemos aprovechar la inactividad del browser y una vez descargados los archivos base podemos iniciar los demas archivos de los modulos y no esperar hasta que el usuario inicia una interacion con ducho modulo.

Ahora mismo nosotros tenemos dos modulos, el pricipal que esta en el App (el cual tendria que ser puesto en un modulo aparte) y el cms. A esto podriamos modularizarlo mas si quisieramos, por ejemplo modularizar la parte de categoria. Pero eso queda para que cada uno lo trabaje por su cuenta.

Por ahora veamos como aplicar la precarga. primero vamos a nuestro app.routing y importamos un clase llamada PreloadAllMoludes

    import { RouterModule, Routes,PreloadAllModules } from '@angular/router';
    ...

    const routes: Routes = [
      ...
    ];

    @NgModule({
      imports: [RouterModule.forRoot(routes, {
        preloadingStrategy: PreloadAllModules
      })],
      exports: [RouterModule]
    })
    export class AppRoutingModule { }

Precargar todos los módulos a la vez, puede ser contraproducente. Imagina que tu aplicación posea 50 o 100 módulos. Sería lo mismo que tener todo en un mismo archivo main.js.

Para solucionar esto, puedes personalizar la estrategia de descarga de módulos indicando qué módulos si se deben precargar y cuáles no; comencemos creando un nuevo servicio.

    ng g s services/custom-preload

Lo primero que vamos a es importar la clase preloadingStrategy y router. Luego manejamos la logica.

    import { Injectable } from '@angular/core';
    import { PreloadingStrategy, Route } from '@angular/router';
    import { Observable, of } from 'rxjs';

    @Injectable({
      providedIn: 'root'
    })
    export class CustomPreloadService implements PreloadingStrategy {

      constructor() { }

      preload(route: Route, load: () => Observable<any>): Observable<any> {
        if (route.data && route.data['preload']) {
          return load()
        }
        return of(null)
      }
    }

De esta manera solo las rutas que tengan data y dentro de data tengan preload = true, se descargaran. volvamos a nuestro app-routing.

    import { CustomPreloadService } from './services/custom-preload.service';
    ...

    const routes: Routes = [
    ...
      {
        path: 'cms',
        loadChildren: () => import('./cms/cms.module').then(m => m.CmsModule),
        data: {
          preload: true
        }
      }
    ];

    @NgModule({
      imports: [RouterModule.forRoot(routes, {
        //preloadingStrategy: PreloadAllModules
        preloadingStrategy: CustomPreloadService
      })],
      exports: [RouterModule]
    })

Con esto ya no usamos el paquete que tiene angular por defecto sino el que yo mismo estoy eligiendo.

## Guardianes

Los Guards en Angular, son de alguna manera: middlewares que se ejecutan antes de cargar una ruta y determinan si se puede cargar dicha ruta o no. Existen 4 tipos diferentes de Guards (o combinaciones de estos) que son los siguientes:

- (CanActivate) Antes de cargar los componentes de la ruta.
- (CanLoad) Antes de cargar los recursos (assets) de la ruta.
- (CanDeactivate) Antes de intentar salir de la ruta actual (usualmente utilizado para evitar salir de una ruta, si no se han guardado los datos).
- (CanActivateChild) Antes de cargar las rutas hijas de la ruta actual.

Para crear uno escribimos el comando

    ng g g guards/auth

Al utilizar este comando, nos hará una pregunta sobre qué interfaz quieres que implemente por defecto. Cada opción tiene una funcionalidad distinta para cada tipo de Guard. Escoge la primera opción llamada CanActivate.

Un Guard puede devolver un booleano, una promesa con un booleano o un observable, también con un booleano. Dependiendo la lógica que tengas que aplicar para el caso sea síncrona o asíncrona.

>Importante: Al hacer este tutorial, note la la api, en la parte de users ya no tenia la capacidad de soportar roles, por lo que vamos a cambiar la url en este caso, para no desperdiciar todo lo que hicimos hasta ahora.

    export class UserService {

      //urlApi = `${environment.API_URL}/api/users`
      urlApi = "https://damp-spire-59848.herokuapp.com/";
      ...
    }

Luego de hacer el cambio vamos a nuestro perfil para trabajar la logica de llamar a un usuario.

    import { Component, OnInit } from '@angular/core';
    import { User } from 'src/app/models/user.models';

    import { AuthService } from '../../../services/auth.service';

    @Component({
      selector: 'app-profile',
      templateUrl: './profile.component.html',
      styleUrls: ['./profile.component.scss']
    })
    export class ProfileComponent implements OnInit {

      user: User | null = null;

      constructor(private authService: AuthService) { }

      ngOnInit(): void {
        this.authService.profile()
          .subscribe(data => {
            this.user = data
          })
      }
    }

Si recuerads bien, ya llamamos a un usuario antes, pero creabamos y haciamos el login a travez de un boton.

**html**

    <div *ngIf="user">
      <h1>My Profile</h1>
      <p>Nombre: {{ user.name }}</p>
      <p>Email: {{ user.email }}</p>
      <p>Role: {{ user.role }}</p>
    </div>

Ahora que tenemos los esencial vamos a el archivo app-routin, para importar nuestro guardian.

    import { Injectable } from '@angular/core';
    import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
    import { Observable } from 'rxjs';
    import { TokenService } from '../services/token.service';

    @Injectable({
      providedIn: 'root'
    })
    export class AuthGuard implements CanActivate {

      constructor(
        private TokenService: TokenService
      ) { }

      canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const token = this.TokenService.getToken();
        return token ? true : false;
      }
    }

Con esto listo podemos ir a nuestro menu, agregar un boton y hacer un nuevo login con la nueva api que soporta el nuevo atributo llamado rol

**html**

    <div class="log">
      <button *ngIf="!profile; else elseBlock" (click)="login()">Login</button>
      <ng-template #elseBlock>
        <a routerLink="/profile">{{ profile?.email }}</a>
        <button (click)="logout()">Logout</button>
      </ng-template>
    </div>

**ts**

    import { AuthService } from '../../../services/auth.service';
    import { Router } from '@angular/router';

    export class NavComponent {
      
      constructor(
      private storeService: StoreService,
      private categoriesService: CategoriesService,
      private authService: AuthService,
      private router: Router
      ) { }

      ngOnInit(): void {
        this.storeService.myCart$.subscribe(products => {
          this.counter = products.length;
        })
        this.getAllCategories();
        this.authService.user$
          .subscribe(data => {
            this.profile = data;
          })
      }

      ...

      login() {
        this.authService.login("john@mail.com", "changeme")
          .subscribe(data => {
            this.router.navigate(['/profile']);
          })
      }

      logout() {
        this.authService.logout()
        this.profile = null;
        this.router.navigate(['/home']);
      }
    }

>Nota: los cambios necesarios para que se muestren el en nav tienen un pequeño problema para mostarse sin recargar la pagina, por lo que hice unos cambios implementando un switchmap, recomiendo mirar el repositorio si no entienden el ejemplo.

    login(email: string, password: string) {
        return this.http.post<Auth>(`${this.urlApi}/login`, { email, password })
          .pipe(tap(response => this.TokenService.saveToken(response.access_token)))
          .pipe(switchMap(() => this.profile()))
      }

Ahora, si todo va bien y pudieron hacer andar la aplocacion hasta aqui, entonces al redireccionar en profile de manera manual, al estar protegido, este nos manda a una pagina en blanco, lo cual no esta completamente bien. Lo correcto seria ser redireccionado a otra pagina.

    import { Router } from '@angular/router';
    ...

    export class AuthGuard implements CanActivate {

      constructor(
        private TokenService: TokenService,
        private router: Router
      ) { }

      canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const token = this.TokenService.getToken();
        //return token ? true : false;
        if (!token) {
          this.router.navigate(['/home'])
          return false
        }
        return true
      }
    }

Con este nuevo cambio, al implementar el nuevo decorador, si la persona que quiera entrar no tiene acceso, entonces sera redireccionado al home.

>nota: En cuanto a la logica de cerrar sesion, no es muy diferente a la que ya hicimos, por lo que lo dejo para que puedan verlo en el repositorio, porque a esta altura no veo el valor de mostar lo mismo.

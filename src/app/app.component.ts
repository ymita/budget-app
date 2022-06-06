import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  NavigationStart,
  Router,
  NavigationEnd,
  ActivatedRoute,
  NavigationCancel,
  NavigationError
} from '@angular/router';

// RxJS
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

// Ignite UI for Angular
import { IgxNavigationDrawerComponent } from 'igniteui-angular';

// App
import { NAVIGATION_ITEMS } from './shared/navigation-items';
import { LoaderService } from './shared/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title: string;

  loading$: Observable<boolean>;

  public navigationItems: Array<{
    icon: string;
    link: string;
    text: string;
  }> = [];

  @ViewChild(IgxNavigationDrawerComponent)
  public navdrawer: IgxNavigationDrawerComponent;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loader: LoaderService
  ) {
    this.navigationItems = [...NAVIGATION_ITEMS];
    this.loading$ = this.loader.loaderState$;
  }

  public ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        if (event.url !== '/' && !this.navdrawer.pin) {
          this.loader.show();
          this.navdrawer.close();
        }
      });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(event => {
        this.loader.hide();
        this.title = event['title'];
      });

    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationCancel ||
            event instanceof NavigationError
        )
      )
      .subscribe(event => {
        this.loader.hide();
      });
  }
}

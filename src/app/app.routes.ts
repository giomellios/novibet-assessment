import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./features/search/pages/search-page/search-page.component').then((m) => m.SearchPageComponent),
		title: 'Movie Search'
	},
	{
		path: 'movie/:id',
		loadComponent: () =>
			import('./features/movies/pages/movie-details-page/movie-details-page.component').then((m) => m.MovieDetailsPageComponent),
		title: 'Movie Details'
	},
	{
		path: 'movie/:id',
		outlet: 'modal',
		loadComponent: () =>
			import('./features/movies/pages/movie-details-page/movie-details-page.component').then((m) => m.MovieDetailsPageComponent),
		title: 'Movie Details'
	},
	{
		path: 'collections',
		loadComponent: () =>
			import('./features/collections/pages/collections-page/collections-page.component').then((m) => m.CollectionsPageComponent),
		title: 'Collections'
	},
	{
		path: 'collections/create',
		loadComponent: () =>
			import('./features/collections/pages/collection-create-page/collection-create-page.component').then((m) => m.CollectionCreatePageComponent),
		title: 'Create Collection'
	},
	{
		path: 'collections/:id',
		loadComponent: () =>
			import('./features/collections/pages/collection-details-page/collection-details-page.component').then((m) => m.CollectionDetailsPageComponent),
		title: 'Collection Details'
	},
	{
		path: '**',
		redirectTo: ''
	}
];

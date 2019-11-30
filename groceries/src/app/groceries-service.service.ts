import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class GroceriesServiceService {
	items: any  = [];
	dataChanged$: Observable<boolean>;
	private dataChangeSubject: Subject<boolean>;
	baseURL = 'http://localhost:8080';

	constructor(public http: HttpClient) {
		console.log('Hello GroceriesService ...');
		this.dataChangeSubject = new Subject<boolean>();
		this.dataChanged$ = this.dataChangeSubject.asObservable();
	}

	//get items
	getItems(): Observable<object[]> {
		return this.http.get(this.baseURL + '/api/groceries').pipe(
			map(this.extractData),
			catchError(this.handleError)
		);
	}

	//data extraction
	private extractData(res: Response) {
		let body = res;
		return (body || {}) as object[];
	}

	//error handling
	private handleError(error: Response | any) {
		let errMsg: string;
		if (error instanceof Response) {
			const err = error || '';
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		return throwError(errMsg);
	}

	//add item
	addItem(item) {
		//this.items.push(item);
		this.http.post(this.baseURL + '/api/groceries', item).subscribe(res => {
			this.items = res;
			this.dataChangeSubject.next(true);
		});
  }

	//edit item
	editItem(item, id) {
		//this.items[index] = item;
		this.http.put(this.baseURL + '/api/groceries/' + id, item).subscribe(res => {
			this.items = res;
			this.dataChangeSubject.next(true);
		});
	}

	//remove item
	removeItem(index) {
		//this.items.splice(index, 1);
		this.http.delete(this.baseURL + '/api/groceries/' + index).subscribe(res => {
			this.items = res;
			this.dataChangeSubject.next(true);
		});
	}

}

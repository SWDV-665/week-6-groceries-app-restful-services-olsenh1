import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { GroceriesServiceService } from '../groceries-service.service';
import { InputDialogServiceService } from '../input-dialog-service.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
	title = "Groceries";
	author = "Henrik Olsen (0913075)";
	items = [];
	errorMessage : string;

	constructor(public toastCtrl: ToastController, 
				public alertCtrl: AlertController, 
				public inputDialogService: InputDialogServiceService, 
				public socialSharing: SocialSharing, 
				public dataService: GroceriesServiceService)
		{
			dataService.dataChanged$.subscribe((dataChanged: boolean) => { this.loadItems(); });
			this.loadItems();
		}

	ionViewDidLoad() {
		this.loadItems();
	}

	//load items
	loadItems() {
		this.dataService.getItems().subscribe(
		items => this.items = items,
		error => this.errorMessage = <any> error);
	}

	//share item
	async shareItem(item, index){
		var toastMsg = "< " + item.name + " (" + item.quantity + ")> shared...";
		const toast = await this.toastCtrl.create({
			message: toastMsg,
			duration: 3000
		});
		let message = "Sharing Grocery Item: " + item.name + " (" + item.quantity + ")";
		let subject = "Shared via Groceries app";
		this.socialSharing.share(message, subject).then(() => {
			// sharing via email is possible
			console.log("Shared Successfully!");
		}).catch((error) => {
			// sharing via email is not possible
			console.error("Error sharing via Groceries app", error);
		});
		toast.present();
	}

	//add item
	async addItem() {
		console.log("Adding item...")
		this.inputDialogService.showPrompt();
	}

	//edit item
	async editItem(item, index) {
		console.log("Editing item <" + item.name + " (" + item.quantity + ")>...")
		this.inputDialogService.showPrompt(item, item._id);
	}

	//remove item
	async removeItem(item, index){
		console.log('Deleting item <' + item.name + ' (' + item.quantity + ')>');
		var toastMsg = "< " + item.name + " (" + item.quantity + ")> removed from " + this.title + "… ";
		const toast = await this.toastCtrl.create({
			message: toastMsg,
			duration: 3000
		});
		toast.present();
		this.dataService.removeItem(item._id);
	}

}

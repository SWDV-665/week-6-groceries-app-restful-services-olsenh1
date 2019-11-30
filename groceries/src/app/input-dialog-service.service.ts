import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GroceriesServiceService } from './groceries-service.service';

@Injectable({
	providedIn: 'root'
})

export class InputDialogServiceService {

	constructor(public alertController: AlertController, 
				public dataService: GroceriesServiceService)
		{ }

  //add or edit item
	async showPrompt(item?, itemId?) {
		itemId: item ? item._id : undefined;
		const alert = await this.alertController.create({
			header: item ? 'Edit ' + item.name + '...'  : 'Add new Item',
			message: item ? 'Please edit name and/or quantity...' : 'Please enter new item...',
			inputs: [
				{
					name: 'name',
					type: 'text',
					placeholder: 'Name',
					value: item ? item.name : null
				},
				{
					name: 'quantity',
					type: 'number',
					placeholder: 'Quantity',
					value: item ? item.quantity : null
				}
			],
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: data => {
						console.log('Confirm Cancel');
					}
				},
				{
					text: 'Save',
					handler: item => {
					console.log('Save Clicked', item.name);
						if (itemId == undefined) {
							this.dataService.addItem(item);
							console.log('Adding new item: <' + item.name + ' (' + item.quantity + ')>...');
						} else {
							console.log('Updating item: <' + item.name + ' (' + item.quantity + ')>...');
							this.dataService.editItem(item, itemId);
						}
					}
				}
			]
		});
		await alert.present();
	}
}

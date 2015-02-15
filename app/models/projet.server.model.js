'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Projet Schema
 */
var ProjetSchema = new Schema({
	projectName: {
		type: String,
		default: '',
		required: 'Merci de Saisir le Nom du Projet',
		trim: true
	},
	projectDescription :{
		type: String,
		required: 'Merci de Saisir une Description de votre projet'
	},
	projectAdresses:{
	city:{
		type :String
	},
	zipCode:{
		type:String
	},
	avenue:{
		type:String
	}
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Projet', ProjetSchema);

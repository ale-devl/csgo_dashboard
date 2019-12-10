"use strict";
sap.ui.define([
	'sap/ui/Device',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/Popover',
	'sap/m/Button',
	'sap/m/library'
], function (Device, Controller, JSONModel, Popover, Button, mobileLibrary) {

	return Controller.extend("csgo.dashboard.controller.App", {
		onItemSelect: function (oEvent) {
			let item = oEvent.getParameter('item');
			this.byId("pageContainer").to(this.getView().createId(item.getKey()));
		},

		onMenuButtonPress: function () {
			let toolPage = this.byId("toolPage");

			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		},

		formatIconSrc: function () {
			let oModelData = this.oView.getModel("practice").getData();
			if (oModelData.status === "up") {
				return "sap-icon://arrow-top";
			} else {
				return "sap-icon://arrow-bottom";
			}
		},

		formatIconColor: function () {
			let oModelData = this.oView.getModel("practice").getData();
			if (oModelData.status === "up") {
				return "Positive";
			} else {
				return "Negative";
			}
		}
	});
});

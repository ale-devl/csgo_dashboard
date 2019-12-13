"use strict";
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {

    return Controller.extend("csgo.dashboard.controller.App", {
        onInit: function () {
            let dataSources = this.getOwnerComponent().getManifestEntry("sap.app").dataSources;
            this.dataSources = {
                practice: `${dataSources.server_data.uri}/practice`,
                retakes: `${dataSources.server_data.uri}/retakes`
            };
			this.dataRefreshIntervals = {};

            this.setupServerDataInterval("practice", {
                model: this.practiceModel,
                uri: this.dataSources.practice,
                time: 60000
            });
            this.setupServerDataInterval("retakes", {
                model: this.retakesModel,
                uri: this.dataSources.retakes,
                time: 60000
            });
        },

        setupServerDataInterval: function (server, settings) {
            if (!this.dataRefreshIntervals[server]) {
                this.dataRefreshIntervals[server] = setTimeout(() => {
                    settings.model.loadData(`${settings.uri}/query`);
                    delete this.dataRefreshIntervals[server];
                    this.setupServerDataInterval(server, settings);
                }, settings.time);
            } else {
                clearInterval(this.dataRefreshIntervals[server]);
            }
        },

        onItemSelect: function (oEvent) {
            let item = oEvent.getParameter("item");
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
        },

        onServerActionButtonPress: function (oAction) {
            switch (oAction.action) {
                case "update":
                    this.updateServer(oAction.server)
                    break;
                case "restart":
                    this.restartServer(oAction.server);
                    break;
                default:
                    return;
            }
        },

        restartServer: function (oServer) {

        },

        updateServer: function (oServer) {
			MessageBox.confirm("Are you sure you want to update the server? Note that this will cause some downtime even if no updates are available", {
				title: "Confirm update",
				onClose: async () => {
					const response = await fetch(`${this.dataSources.practice}/update`);
				}
			});
        }
    });
});

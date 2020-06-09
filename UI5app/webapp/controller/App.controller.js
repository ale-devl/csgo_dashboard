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
                practice: `${dataSources.server_root.uri}/practice`,
                retakes: `${dataSources.server_root.uri}/retakes`
            };
            this.dataRefreshIntervals = {};
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

        formatIconSrc: function (status) {
            if (status === "up") {
                return "sap-icon://arrow-top";
            } else {
                return "sap-icon://arrow-bottom";
            }
        },

        formatIconColor: function (status) {
            if (status === "up") {
                return "Positive";
            } else {
                return "Negative";
            }
        },

        formatMapName: function (mapName) {
            var aMapParts = mapName.split("/");

            return aMapParts[aMapParts.length - 1];
        },

        onServerActionButtonPress: function (oAction, oEvent) {
            let oServerData = oEvent.getSource().getBindingContext("server").getObject(),
                oCard = oEvent.getSource().getParent().getParent().getParent();

            switch (oAction.action) {
                case "update":
                    this.updateServer(oServerData.id, oCard)
                    break;
                case "restart":
                    this.restartServer(oServerData.id, oCard);
                    break;
                default:
                    return;
            }
        },

        restartServer: async function (id, card) {
            card.setBusy(true);
            await fetch(`${this.dataSources[id]}/restart`);
            card.setBusy(false);
            return;
        },

        updateServer: function (id, card) {
            MessageBox.confirm("Are you sure you want to update the server? Note that this will cause some downtime even if no updates are available", {
                title: "Confirm update",
                onClose: async () => {
                    card.setBusy(true);
                    await fetch(`${this.dataSources[id]}/update`);
                    card.setBusy(false);
                }
            });
        }
    });
});

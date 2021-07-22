sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/f/library'
], function(Controller, fioriLibrary) {
	"use strict";

	return Controller.extend("sap.ui.demo.fiori2.controller.Detail", {
		onInit: function() {
			this.oOwnerComponent = this.getOwnerComponent();

			this.oRouter = this.oOwnerComponent.getRouter();
			this.oModel = this.oOwnerComponent.getModel();

			this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onProductMatched, this);
		},

		onSupplierPress: function(oEvent) {

			var supplierPath = oEvent.getSource().getBindingContext("products").getPath(),
				supplier = supplierPath.split("/").slice(-1).pop();
			this.oRouter.navTo("detailDetail", {layout: fioriLibrary.LayoutType.ThreeColumnsMidExpanded, supplier: supplier, product: this._product});
			
			// this.oOwnerComponent.getHelper().then(function(oHelper) {
			// 	this.oRouter.navTo("detailDetail", {
			// 		supplier: supplier,
			// 		product: this._product
			// 	});
			// });
			// var supplierPath = oEvent.getSource().getBindingContext("products").getPath(),
			// 	supplier = supplierPath.split("/").slice(-1).pop(),
			// 	oNextUIState;

			// this.oOwnerComponent.getHelper().then(function(oHelper) {
			// 	oNextUIState = oHelper.getNextUIState(2);
			// 	this.oRouter.navTo("detailDetail", {
			// 		layout: oNextUIState.layout,
			// 		supplier: supplier,
			// 		product: this._product
			// 	});
			// }.bind(this));
		},

		_onProductMatched: function(oEvent) {
			this._product = oEvent.getParameter("arguments").product || this._product || "0";
			this.getView().bindElement({
				path: "/ProductCollection/" + this._product,
				model: "products"
			});
			// var sBindAggregationPath = "products>/ProductCollectionStats/Filters/1/values";
			var sBindAggregationPath = "products>/ProductCollectionStats/Filters/" + this._product + "/values";
			var escTable = this.getView().byId("suppliersTable");
			var oEscTemplate = escTable.getBindingInfo("items").template;
			// escTable.unbindItems();
			escTable.bindItems(sBindAggregationPath, oEscTemplate);
			// var oTable = this.byId("suppliersTable");
			// oTable.bindAggregation("items", {
			// 	path: sBindAggregationPath,
			// 	template:
			// });

		},
		handleSearch: function(liveq) {
			var livequery = liveq.getParameters().newValue;
			var filters = [];
			// var filter = new sap.ui.model.Filter("ZproductName", FilterOperator.Contains, livequery);
			// filters.push(filter);
			var tabledata = this.byId("suppliersTable");
			var binding = tabledata.getBinding("items");
			// binding.filter(filter);
		},
		onEditToggleButtonPress: function() {
			var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();

			oObjectPage.setShowFooter(!bCurrentShowFooterState);
		},

		handleFullScreen: function() {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("detail", {
				layout: sNextLayout,
				product: this._product
			});
		},

		handleExitFullScreen: function() {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.oRouter.navTo("detail", {
				layout: sNextLayout,
				product: this._product
			});
		},

		handleClose: function() {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("master", {
				layout: sNextLayout
			});
		},

		onExit: function() {
			this.oRouter.getRoute("master").detachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onProductMatched, this);
		}
	});
});
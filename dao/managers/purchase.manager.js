const purchaseModel = require ("../models/purchase.model.js")
const BaseManager = require ("../managers/base.manager.js")

class PurchaseOrder extends BaseManager {
    constructor () {
        super (purchaseModel)
    }
}

module.exports = new PurchaseOrder()
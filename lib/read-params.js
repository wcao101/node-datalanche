// constructor

function ReadParams() {
    this.dataset = null;
    this.columns = null;
    this.filter = null;
    this.limit = null;
    this.skip = null;
    this.sort = null;
    this.total = null;
}
module.exports = ReadParams;

// methods

ReadParams.prototype.sortAsc = function(column) {
    if (this.sort === null) {
        this.sort = [];
    }
    if (Array.isArray(this.sort) === false) {
        throw new Error('ReadParams.sort must be an array, but it is not');
    }
    this.sort.push(column.toString() + ':$asc');
    return this; // allow method chaining
}

ReadParams.prototype.sortDesc = function(column) {
    if (this.sort === null) {
        this.sort = [];
    }
    if (Array.isArray(this.sort) === false) {
        throw new Error('ReadParams.sort must be an array, but it is not');
    }
    this.sort.push(column.toString() + ':$desc');
    return this; // allow method chaining
}

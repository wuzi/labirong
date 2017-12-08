function AssetManager() {
    this.cache = {};
    this.errorCount = 0;
    this.successCount = 0;
    this.downloadQueue = [];
}

AssetManager.prototype.queueDownload = function (path) {
    this.downloadQueue.push(path);
}

AssetManager.prototype.downloadAll = function (downloadCallback) {
    if (this.downloadQueue.length === 0) {
        downloadCallback();
    }
    
    var progessBar = document.getElementById("myBar"); 
    for (var i = 0; i < this.downloadQueue.length; i++) {
        var path = this.downloadQueue[i];
        var img = new Image();
        var that = this;
        img.addEventListener("load", function () {
            that.successCount += 1;
            progessBar.style.width = (that.successCount / that.downloadQueue.length) * 100 + '%';
            progessBar.innerHTML = (that.successCount / that.downloadQueue.length) * 100 + '%';
            if (that.isDone()) {
                downloadCallback();
            }
        }, false);
        img.addEventListener("error", function () {
            that.errorCount += 1;
            if (that.isDone()) {
                downloadCallback();
            }
        }, false);
        img.src = path;
        this.cache[path] = img;
    }
}

AssetManager.prototype.isDone = function () {
    return (this.downloadQueue.length == this.successCount + this.errorCount);
}

AssetManager.prototype.getAsset = function (path) {
    return this.cache[path];
}
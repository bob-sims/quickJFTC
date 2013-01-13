var isAndroid = Ti.Platform.osname === "android", TiMiniBrowser = function(dict) {
    this.dict = dict;
    this.c = {};
    isAndroid || this.createComponents();
};

TiMiniBrowser.prototype.createComponents = function() {
    var self = this;
    this.c.activityIndicator = Ti.UI.createActivityIndicator();
    this.c.activityIndicator.show();
    this.c.window = Ti.UI.createWindow({
        rightNavButton: this.c.activityIndicator,
        modal: typeof this.dict.modal != "undefined" ? this.dict.modal : !0,
        barImage: "/img/menubar.png",
        title: typeof this.dict.title != "undefined" ? this.dict.title : undefined,
        orientationModes: [ Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT, Ti.UI.PORTRAIT ]
    });
    if (typeof this.dict.modal == "undefined" || this.dict.modal === !0) {
        this.c.closeButton = Ti.UI.createButton({
            title: L("close", "Close"),
            backgroundImage: "/img/ipad-button-blue.png",
            backgroundSelectedImage: "/img/ipad-button-blue-pressed.png",
            color: "white",
            shadowColor: "white",
            shadowOffset: {
                x: 0,
                y: 1
            },
            font: {
                fontWeight: "bold",
                fontSize: 14
            },
            borderWidth: 1,
            borderRadius: 10,
            borderColor: "#094B7B",
            height: 25,
            width: 50
        });
        this.c.window.setLeftNavButton(this.c.closeButton);
        this.c.closeButton.addEventListener("click", function() {
            self.c.window.close();
        });
    }
    this.c.webView = Ti.UI.createWebView({
        url: this.dict.url,
        bottom: this.dict.showToolbar == 1 ? 44 : 0,
        loading: !1
    });
    this.c.window.add(this.c.webView);
    this.c.actionsDialog = Ti.UI.createOptionDialog({
        options: [ L("copy_link", "Copy link"), L("open_browser", "Open in Browser"), L("send_by_email", "Send by email"), L("cancel", "Cancel") ],
        cancel: 3
    });
    if (typeof this.dict.showToolbar == "undefined" || this.dict.showToolbar === !0) {
        this.c.buttonAction = Ti.UI.createButton({
            systemButton: Titanium.UI.iPhone.SystemButton.ACTION,
            enabled: !1
        });
        this.c.buttonBack = Ti.UI.createButton({
            image: "/img/Icon-Back.png",
            enabled: !1
        });
        this.c.buttonForward = Ti.UI.createButton({
            image: "/img/Icon-Forward.png",
            enabled: !1
        });
        this.c.buttonStop = Ti.UI.createButton({
            systemButton: Titanium.UI.iPhone.SystemButton.STOP
        });
        this.c.buttonRefresh = Ti.UI.createButton({
            systemButton: Titanium.UI.iPhone.SystemButton.REFRESH
        });
        this.c.buttonSpace = Ti.UI.createButton({
            systemButton: Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
        });
        this.c.toolbar = Ti.UI.iOS.createToolbar({
            barColor: this.dict.barColor,
            bottom: 0,
            height: 44,
            items: [ this.c.buttonBack, this.c.buttonSpace, this.c.buttonForward, this.c.buttonSpace, this.c.buttonRefresh, this.c.buttonSpace, this.c.buttonAction ]
        });
        this.c.window.add(this.c.toolbar);
        this.c.buttonBack.addEventListener("click", function() {
            self.c.webView.goBack();
        });
        this.c.buttonForward.addEventListener("click", function() {
            self.c.webView.goForward();
        });
        this.c.buttonStop.addEventListener("click", function() {
            self.c.activityIndicator.hide();
            self.c.webView.stopLoading();
            self.c.buttonBack.setEnabled(self.c.webView.canGoBack());
            self.c.buttonForward.setEnabled(self.c.webView.canGoForward());
            self.c.buttonAction.setEnabled(!0);
            self.c.actionsDialog.setTitle(self.c.webView.getUrl());
            self.updateToolbarItems(!1);
        });
        this.c.buttonRefresh.addEventListener("click", function() {
            self.c.webView.reload();
        });
        this.c.buttonAction.addEventListener("click", function() {
            self.c.actionsDialog.show();
        });
    }
    this.c.webView.addEventListener("load", function() {
        self.c.window.setRightNavButton(null);
        self.updateComponentsTitle();
        self.updateToolbarItems(!1);
    });
    this.c.webView.addEventListener("beforeload", function() {
        self.c.window.setRightNavButton(self.c.activityIndicator);
        self.updateToolbarItems(!0);
    });
    this.c.webView.addEventListener("error", function() {
        self.c.window.setRightNavButton(null);
        self.updateComponentsTitle();
        self.updateToolbarItems(!1);
    });
    this.c.actionsDialog.addEventListener("click", function(e) {
        switch (e.index) {
          case 0:
            Ti.UI.Clipboard.setText(self.c.webView.getUrl());
            break;
          case 1:
            var url = self.c.webView.getUrl();
            Ti.Platform.canOpenURL(url) && Ti.Platform.openURL(url);
            break;
          case 2:
            var emailDialog = Ti.UI.createEmailDialog({
                barColor: self.c.window.barColor
            });
            emailDialog.subject = self.c.window.getTitle();
            emailDialog.messageBody = self.c.webView.getUrl();
            emailDialog.open();
        }
    });
};

TiMiniBrowser.prototype.updateComponentsTitle = function() {
    typeof this.dict.title == "undefined" && this.c.window.setTitle(this.c.webView.evalJS("document.title"));
    this.c.actionsDialog.title = this.c.webView.getUrl();
};

TiMiniBrowser.prototype.updateToolbarItems = function(isLoading) {
    typeof isLoading == "undefined" && (isLoading = !1);
    if (isLoading === !1) {
        this.c.buttonBack.enabled = this.c.webView.canGoBack();
        this.c.buttonForward.enabled = this.c.webView.canGoForward();
        this.c.buttonAction.enabled = !0;
        this.c.toolbar.items = [ this.c.buttonBack, this.c.buttonSpace, this.c.buttonForward, this.c.buttonSpace, this.c.buttonRefresh, this.c.buttonSpace, this.c.buttonAction ];
    } else {
        this.c.buttonAction.setEnabled(!1);
        this.c.toolbar.items = [ this.c.buttonBack, this.c.buttonSpace, this.c.buttonForward, this.c.buttonSpace, this.c.buttonStop, this.c.buttonSpace, this.c.buttonAction ];
    }
};

TiMiniBrowser.prototype.open = function() {
    isAndroid ? Ti.Platform.openURL(this.dict.url) : this.c.window.open();
};

TiMiniBrowser.prototype.getWindow = function() {
    return this.c.window;
};

module.exports = TiMiniBrowser;
define(["itemHelper", "libraryMenu", "apphost"], function(itemHelper, libraryMenu, appHost) {
    "use strict";

    function initSyncButtons(view) {
        var apiClient = window.ApiClient;
        apiClient && apiClient.getCurrentUserId() && apiClient.getCurrentUser().then(function(user) {
            for (var item = {
                    SupportsSync: !0
                }, categorySyncButtons = view.querySelectorAll(".categorySyncButton"), i = 0, length = categorySyncButtons.length; i < length; i++) categorySyncButtons[i].addEventListener("click", onCategorySyncButtonClick), itemHelper.canSync(user, item) ? categorySyncButtons[i].classList.remove("hide") : categorySyncButtons[i].classList.add("hide")
        })
    }

    function onCategorySyncButtonClick(e) {
        var button = this,
            category = button.getAttribute("data-category"),
            parentId = libraryMenu.getTopParentId();
        require(["syncDialog"], function(syncDialog) {
            syncDialog.showMenu({
                ParentId: parentId,
                Category: category,
                serverId: ApiClient.serverId(),
                mode: appHost.supports("sync") ? "download" : "sync"
            })
        })
    }
    return {
        init: function(view) {
            initSyncButtons(view)
        }
    }
});
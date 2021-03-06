define(["shell", "dialogHelper", "loading", "layoutManager", "connectionManager", "appRouter", "globalize", "emby-input", "emby-checkbox", "paper-icon-button-light", "emby-select", "material-icons", "css!./../formdialog", "emby-button"], function(shell, dialogHelper, loading, layoutManager, connectionManager, appRouter, globalize) {
    "use strict";

    function parentWithClass(elem, className) {
        for (; !elem.classList || !elem.classList.contains(className);)
            if (!(elem = elem.parentNode)) return null;
        return elem
    }

    function getEditorHtml() {
        var html = "";
        return html += '<div class="formDialogContent smoothScrollY" style="padding-top:2em;">', html += '<div class="dialogContentInner dialog-content-centered">', html += '<form style="margin:auto;">', html += '<div class="fldSelectPlaylist selectContainer">', html += '<select is="emby-select" id="selectMetadataRefreshMode" label="' + globalize.translate("sharedcomponents#LabelRefreshMode") + '">', html += '<option value="scan">' + globalize.translate("sharedcomponents#ScanForNewAndUpdatedFiles") + "</option>", html += '<option value="missing">' + globalize.translate("sharedcomponents#SearchForMissingMetadata") + "</option>", html += '<option value="all" selected>' + globalize.translate("sharedcomponents#ReplaceAllMetadata") + "</option>", html += "</select>", html += "</div>", html += '<label class="checkboxContainer hide fldReplaceExistingImages">', html += '<input type="checkbox" is="emby-checkbox" class="chkReplaceImages" />', html += "<span>" + globalize.translate("sharedcomponents#ReplaceExistingImages") + "</span>", html += "</label>", html += '<div class="fieldDescription">', html += globalize.translate("sharedcomponents#RefreshDialogHelp"), html += "</div>", html += '<input type="hidden" class="fldSelectedItemIds" />', html += "<br />", html += '<div class="formDialogFooter">', html += '<button is="emby-button" type="submit" class="raised btnSubmit block formDialogFooterItem button-submit">' + globalize.translate("sharedcomponents#Refresh") + "</button>", html += "</div>", html += "</form>", html += "</div>", html += "</div>"
    }

    function centerFocus(elem, horiz, on) {
        require(["scrollHelper"], function(scrollHelper) {
            var fn = on ? "on" : "off";
            scrollHelper.centerFocus[fn](elem, horiz)
        })
    }

    function onSubmit(e) {
        loading.show();
        var instance = this,
            dlg = parentWithClass(e.target, "dialog"),
            options = instance.options,
            apiClient = connectionManager.getApiClient(options.serverId),
            replaceAllMetadata = "all" === dlg.querySelector("#selectMetadataRefreshMode").value,
            mode = "scan" === dlg.querySelector("#selectMetadataRefreshMode").value ? "Default" : "FullRefresh",
            replaceAllImages = "FullRefresh" === mode && dlg.querySelector(".chkReplaceImages").checked;
        return options.itemIds.forEach(function(itemId) {
            apiClient.refreshItem(itemId, {
                Recursive: !0,
                ImageRefreshMode: mode,
                MetadataRefreshMode: mode,
                ReplaceAllImages: replaceAllImages,
                ReplaceAllMetadata: replaceAllMetadata
            })
        }), dialogHelper.close(dlg), require(["toast"], function(toast) {
            toast(globalize.translate("sharedcomponents#RefreshQueued"))
        }), loading.hide(), e.preventDefault(), !1
    }

    function RefreshDialog(options) {
        this.options = options
    }
    return RefreshDialog.prototype.show = function() {
        var dialogOptions = {
            removeOnClose: !0,
            scrollY: !1
        };
        layoutManager.tv ? dialogOptions.size = "fullscreen" : dialogOptions.size = "small";
        var dlg = dialogHelper.createDialog(dialogOptions);
        dlg.classList.add("formDialog");
        var html = "",
            title = globalize.translate("sharedcomponents#RefreshMetadata");
        return html += '<div class="formDialogHeader">', html += '<button is="paper-icon-button-light" class="btnCancel autoSize" tabindex="-1"><i class="md-icon">&#xE5C4;</i></button>', html += '<h3 class="formDialogHeaderTitle">', html += title, html += "</h3>", html += "</div>", html += getEditorHtml(), dlg.innerHTML = html, dlg.querySelector("form").addEventListener("submit", onSubmit.bind(this)), dlg.querySelector("#selectMetadataRefreshMode").addEventListener("change", function() {
            "scan" === this.value ? dlg.querySelector(".fldReplaceExistingImages").classList.add("hide") : dlg.querySelector(".fldReplaceExistingImages").classList.remove("hide")
        }), this.options.mode && (dlg.querySelector("#selectMetadataRefreshMode").value = this.options.mode), dlg.querySelector("#selectMetadataRefreshMode").dispatchEvent(new CustomEvent("change")), dlg.querySelector(".btnCancel").addEventListener("click", function() {
            dialogHelper.close(dlg)
        }), layoutManager.tv && centerFocus(dlg.querySelector(".formDialogContent"), !1, !0), new Promise(function(resolve, reject) {
            layoutManager.tv && centerFocus(dlg.querySelector(".formDialogContent"), !1, !1), dlg.addEventListener("close", resolve), dialogHelper.open(dlg)
        })
    }, RefreshDialog
});
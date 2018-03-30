/* BootstrapTable test plugin begin*/
/**
 * @author David Graham <prograhammer@gmail.com>
 * @version v1.1.4
 * @link https://github.com/prograhammer/bootstrap-table-contextmenu
 */

!function($) {

    'use strict';

    $.extend($.fn.bootstrapTable.defaults, {
        // Option defaults
        onRowTap: function (ev,row) {
            return false;
        }
    });
	
	// Methods
    $.fn.bootstrapTable.methods.push('showContextMenu');

	// Events
    $.extend($.fn.bootstrapTable.Constructor.EVENTS, {
        'contextmenu-item.bs.table': 'onContextMenuItem',
        'contextmenu-row.bs.table': 'onContextMenuRow'
    });

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initBody = BootstrapTable.prototype.initBody;

    BootstrapTable.prototype.initBody = function () {

        // Init Body
        _initBody.apply(this, Array.prototype.slice.apply(arguments));

        // Init Context menu
        this.initTapRow();
    };
	
	// Init context menu
	BootstrapTable.prototype.initTapRow = function () {
		var that = this;
		that.$body.find('> tr[data-index]').off('taphold').on('taphold', function (e) {            	
			var rowData = that.data[$(this).data('index')],
				rv = that.options.onRowTap.apply(this, [e, rowData, null]);
		});
	};

}(jQuery);

/* BootstrapTable test plugin end*/
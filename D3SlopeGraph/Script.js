/// <reference path="lib/js/QvExtensionFramework2.js" />

function D3SlopeGraph_Init() {
    Qva.AddExtension("D3SlopeGraph",
        function () {

            var _ExtensionName = 'D3SlopeGraph';
            var _LoadUrl = Qva.Remote + (Qva.Remote.indexOf('?') >= 0 ? '&' : '?') + 'public=only' + '&name=';
            var _t = this;

            // Define one or more styles sheets to be used within the extension
            var cssFiles = [];
            cssFiles.push('Extensions/' + _ExtensionName + '/lib/css/style.css');
            cssFiles.push('Extensions/' + _ExtensionName + '/lib/css/QvExtensionFramework.css');
            for (var i = 0; i < cssFiles.length; i++) {
                Qva.LoadCSS(_LoadUrl + cssFiles[i]);
            }

            // Define one or more JavaScript files to be loaded within the extension
            var jsFiles = [];
            jsFiles.push('Extensions/' + _ExtensionName + '/lib/js/QvExtensionFramework2.js');
            jsFiles.push('Extensions/' + _ExtensionName + '/lib/js/d3.v3.min.js');
            jsFiles.push('Extensions/' + _ExtensionName + '/lib/js/d3SlopeGraph.js');
            Qv.LoadExtensionScripts(jsFiles, function () {

                var _extFW = new QvExtensionFramework2();
                _extFW.initialize(
                    {
                        doTraceOutput: false,
                        doPersistSettings: true,
                        qvExtension: _t
                    });

                if (_extFW.Settings.get('Initialized') != true) {
                    _extFW.Console.log('Initialize ...');
                    _extFW.Settings.add('Initialized', true);
                }

                // Add Definition Properties
                _extFW.Settings.addDefProp('ValueY1', 0, '');
                _extFW.Settings.addDefProp('ValueY2', 1, '');
                _extFW.Settings.addDefProp('ChartHeight', 2, -1);
                _extFW.Settings.initDefProps();

                // If not already set, initialize the chart container ...
                ensureContainer();
                configContainer();
    
                var margin = 170;
                var d = getData();
                var slopeGraph = new D3SlopeGraph();
                slopeGraph.initialize(
                    {
                        width: _t.GetWidth(),
                        height: (_extFW.Settings.getDefPropValue('ChartHeight') === -1 ? _t.GetHeight() : parseInt(_extFW.Settings.getDefPropValue('ChartHeight'))),
                        data: d,
                        left_margin: margin,
                        right_margin: margin,
                     //   y1: _extFW.Settings.getDefPropValue('ValueY1'),
                     //   y2: _extFW.Settings.getDefPropValue('ValueY2'),
                        uniqueId: _extFW.Settings.getUniqueId()
                    });

                _extFW.Console.info('Draw Chart');
                _extFW.Console.log('ContainerId: ' + _extFW.Settings.get('ContainerId'));
                $('#' + _extFW.Settings.get('ContainerId')).empty();
                slopeGraph.draw('div#' + _extFW.Settings.get('ContainerId'));

                function ensureContainer() {
                    
                    if (!_extFW.Settings.getBool('ContainerInitialized')) {

                        _extFW.Console.log('Add Container ...');

                        var containerId = 'Container_' + _extFW.Settings.getUniqueId();

                        var $container = $(document.createElement('div'));
                        $container.attr('id', containerId);
                        $container.addClass('d3sg_Container');
                        $(_t.Element).append($container);

                        _extFW.Settings.add('ContainerId', containerId);
                        _extFW.Settings.add('ContainerInitialized', true);
                    } else {
                        _extFW.Console.log('Container is already added ...');
                    }
                }

                // Set properties which are necessary on every refresh
                function configContainer() {

                    $('#' + _extFW.Settings.get('ContainerId')).css('height', _t.GetHeight() + 'px');
                }

                function getData() {

                    var data = [];

                    var counter = -1;
                    for (var i = 0; i < _t.Data.Rows.length; i++) {
                        counter++;
                        var label = _t.Data.Rows[i][0].text;
						var labeldim = _t.Data.Rows[i][1].text;
                        var val1 = parseFloat(_t.Data.Rows[i][2].data);
						data[counter] = { label: label, labeldim: labeldim, left: val1 };
						
                    }
                    return data;

                }

     

            });

        })
};

D3SlopeGraph_Init();
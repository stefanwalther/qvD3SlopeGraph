
/// <autosync enabled="true" />
/// <reference path="d3.v3.min.js" />


function D3SlopeGraph() {

    // Default config values
    this.config = {
        width: 500,
        height: 500,
        left_margin: 170,
        right_margin: 170,
        top_margin: 50,     //margin for the main chart, wording is confusing
        bottom_margin: 50,  // margin for the main chart, wording is confusing !
        data: null,
        font_size: 50,      //50 seems to be a good value for font-size 11px
        y1: 'Value 1',
        y2: 'Value 2',
        uniqueId: null
    };

    this.extend = function (a, b) {
        for (var i in b) {
            a[i] = b[i];
        }
    };

    D3SlopeGraph.prototype.config = function () {
        return this.config;
    };

    D3SlopeGraph.prototype.initialize = function (config) {
        // merge default props and passed props
        this.extend(this.config, config);

        //console.log(this.config);

    };

    D3SlopeGraph.prototype.draw = function (selector) {


        var rootConfig = this.config;
        if (!rootConfig.uniqueId) {
            rootConfig.uniqueId = makeid(10);
        }

        var data = this.config.data;
        //console.log(data);

        function _max_key(v) {
            var vi, max_side;
            var _m = undefined;
            for (var i = 0; i < v.length; i += 1) {
                vi = v[i];
                max_side = Math.max(vi.left, vi.right)
                if (_m == undefined || max_side > _m) {
                    _m = max_side;
                }
            }
            //console.log('max_key:' + _m);
            return _m;
        }

        function _min_key(v) {
            var vi, min_side;
            var _m = undefined;
            for (var i = 0; i < v.length; i += 1) {
                vi = v[i];
                min_side = Math.min(vi.left, vi.right)
                if (_m == undefined || min_side < _m) {
                    _m = min_side;
                }
            }
            return _m;
        }

        function _min_max(v) {
            var vi, min_side, max_side;
            var _max = undefined;
            var _min = undefined;


            for (var i = 0; i < v.length; i += 1) {
                vi = v[i];
                min_side = Math.min(vi.left_coord, vi.right_coord);
                max_side = Math.max(vi.left_coord, vi.right_coord);

                if (_min == undefined || min_side < _min) {
                    _min = min_side;
                }
                if (_max == undefined || max_side > _max) {
                    _max = max_side;
                }


            }
            return [_min, _max];
        }

        var _y = d3.scale.linear()
            .domain([_min_key(data), _max_key(this.config.data)])
            .range([this.config.top_margin, this.config.height - this.config.bottom_margin])

        function y(d, i) {
            return this.config.height - _y(d)
        }

        for (var i = 0; i < data.length; i += 1) {
            data[i].left_coord = y(data[i].left);
            data[i].right_coord = y(data[i].right);
        }

        function _slopegraph_preprocess(d) {
            // computes y coords for each data point
            // create two separate object arrays for each side, then order them together, and THEN run the shifting alg.

            var offset;

            var font_size = rootConfig.font_size;
            var l = d.length;

            var max = _max_key(d);
            var min = _min_key(d);
            var range = max - min;

            //
            var left = [];
            var right = [];
            var di
            for (var i = 0; i < d.length; i += 1) {
                di = d[i];
                left.push({ label: di.label, value: di.left, side: 'left', coord: di.left_coord })
                right.push({ label: di.label, value: di.right, side: 'right', coord: di.right_coord })
            }

            var both = left.concat(right)
            both.sort(function (a, b) {
                if (a.value > b.value) {
                    return 1
                } else if (a.value < b.value) {
                    return -1
                } else {
                    if (a.label > b.label) {
                        return 1
                    } else if (a.lable < b.label) {
                        return -1
                    } else {
                        return 0
                    }
                }
            }).reverse()
            var new_data = {};
            var side, label, val, coord;
            for (var i = 0; i < both.length; i += 1) {

                label = both[i].label;
                side = both[i].side;
                val = both[i].value;
                coord = both[i].coord;

                if (!new_data.hasOwnProperty(both[i].label)) {
                    new_data[label] = {}
                }
                new_data[label][side] = val;

                if (i > 0) {
                    if (coord - font_size < both[i - 1].coord ||
                        !(val === both[i - 1].value && side != both[i - 1].side)) {

                        new_data[label][side + '_coord'] = coord + font_size;

                        for (j = i; j < both.length; j += 1) {
                            both[j].coord = both[j].coord + font_size;
                        }
                    } else {
                        new_data[label][side + '_coord'] = coord;
                    }

                    if (val === both[i - 1].value && side !== both[i - 1].side) {
                        new_data[label][side + '_coord'] = both[i - 1].coord;
                    }
                } else {
                    new_data[label][side + '_coord'] = coord;
                }

            }
            d = [];

            var z = 0;
            for (var label in new_data) {
                val = new_data[label];
                val.label = label;
                val.index = z;
                d.push(val)
                z++;
            }

            return d;
        }

        data = _slopegraph_preprocess(data)
        var min, max;
        var _ = _min_max(data)
        min = _[0]
        max = _[1]

        //HEIGHT = max + this.config.top_margin + BOTTOM_MARGIN

        var sg = d3.select(selector)
            .append('svg:svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height);

        _y = d3.scale.linear()
            .domain([max, min])
            .range([this.config.top_margin, this.config.height - this.config.bottom_margin])

        function y(d, i) {
            return rootConfig.height - _y(d)
        }

        // Left Label
        sg.selectAll('.left_labels')
            .data(data).enter().append('svg:text')
                .attr('x', this.config.left_margin - 50)
                .attr('y', function (d, i) {
                    return y(d.left_coord)
                })
                .attr('dy', '.35em')
                .attr('id', function (d, i) {
                    return 'll_' + rootConfig.uniqueId + '_' + d.index;
                })
                .attr('index', function (d, i) {
                    return d.index;
                })
                .attr('text-anchor', 'end')
                .attr('class', 'd3sg tl left')
                .text(function (d, i) { return d.label })
                    .attr('title', function (d, i) { return d.label })
                    .attr('fill', 'black')
                     .on('mouseover', function (d, i) {
                         sectorOver(this, d);
                     })
                    .on('mouseout', function (d, i) {
                        sectorOut(d);
                    });

        //Tooltip
        var divTooltip = d3.select(selector).append('div')
                        .attr('class', 'd3sg_ToolTip')
                        .style('opacity', 0);

        var leftOffset = $(selector).offset().left;
        var topOffset = $(selector).offset().top;

        // Left Value
        sg.selectAll('.left_values')
            .data(data).enter().append('svg:text')
                .attr('x', this.config.left_margin - 10)
                .attr('y', function (d, i) {
                    return y(d.left_coord)
                })
                .attr('id', function (d, i) {
                    return 'lv_' + rootConfig.uniqueId + '_' + d.index;
                })
                .attr('index', function (d, i) {
                    return d.index;
                })
                .attr('dy', '.35em')
                //.attr('font-size', 10)
                .attr('class', 'd3sg v left')
                .attr('text-anchor', 'end')
                .text(function (d, i) { return d.left })
                .attr('fill', 'black')
                 .on('mouseover', function (d, i) {
                     sectorOver(this, d);
                 })
                .on('mouseout', function (d, i) {
                    sectorOut(d);
                });

        // Right Label
        sg.selectAll('.right_labels')
            .data(data).enter().append('svg:text')
                .attr('x', this.config.width - this.config.right_margin)
                .attr('y', function (d, i) {
                    return y(d.right_coord)
                })
                .attr('id', function (d, i) {
                    return 'rl_' + rootConfig.uniqueId + '_' + d.index;
                })
                .attr('index', function (d, i) {
                    return d.index;
                })
                .attr('dy', '.35em')
                .attr('dx', 50)
                .attr('class', 'd3sg tl right')
                .text(function (d, i) { return d.label })
                 .on('mouseover', function (d, i) {
                     sectorOver(this, d);
                 })
                .on('mouseout', function (d, i) {
                    sectorOut(d);
                });

        // Right Value
        sg.selectAll('.right_values')
            .data(data).enter().append('svg:text')
                .attr('x', this.config.width - this.config.right_margin)
                .attr('y', function (d, i) {
                    return y(d.right_coord)
                })
                .attr('id', function (d, i) {
                    return 'rv_' + rootConfig.uniqueId + '_' + d.index;
                })
                .attr('index', function (d, i) {
                    return d.index;
                })
                .attr('dy', '.35em')
                .attr('dx', 10)
                .attr('class', 'd3sg v right')
                .text(function (d, i) { return d.right })
                .attr('fill', 'black')
                 .on('mouseover', function (d, i) {
                     sectorOver(this, d);
                 })
                .on('mouseout', function (d, i) {
                    sectorOut(d);
                });

        // Title Left
        sg.append('svg:text')
            .attr('x', this.config.left_margin)
            .attr('y', this.config.top_margin / 2)
            .attr('text-anchor', 'end')
            .attr('opacity', .5)
            .attr('class', 'd3sg t')
            .text(rootConfig.y1)

        // Title Right
        sg.append('svg:text')
            .attr('x', this.config.width - this.config.right_margin)
            .attr('y', this.config.top_margin / 2)
            .attr('opacity', .5)
            .attr('class', 'd3sg t')
            .text(rootConfig.y2)

        // Lines
        sg.selectAll('.slopes')
            .data(data).enter().append('svg:line')
                .attr('x1', this.config.left_margin)
                .attr('x2', this.config.width - this.config.right_margin)
                .attr('y1', function (d, i) {
                    //console.log(d);
                    return y(d.left_coord)
                })
                .attr('y2', function (d, i) {
                    return y(d.right_coord)
                })
                //.attr('opacity', .6)
                //.attr('stroke', 'black')
                .attr('class', 'd3sg stroke')
                .attr('id', function (d, i) {
                    return 'stroke_' + rootConfig.uniqueId + '_' + d.index;
                })
                .attr('index', function (d, i) {
                    return d.index;
                })
                .on('mouseover', function (d, i) {
                    sectorOver(this, d);                    
                })
                .on('mouseout', function (d, i) {
                    sectorOut(d);
                });

        function sectorOver(o, d) {

            //console.group('Sector Over');
            //console.log(d);
            //console.log(o);
            //console.groupEnd();

            var strokeId = '#stroke_' + rootConfig.uniqueId + '_' + d.index;
            var lineId = '#line_' + rootConfig.uniqueId + '_' + d.index;
            var llId = '#ll_' + rootConfig.uniqueId + '_' + d.index;
            var lvId = '#lv_' + rootConfig.uniqueId + '_' + d.index;
            var rvId = '#rv_' + rootConfig.uniqueId + '_' + d.index;
            var rlId = '#rl_' + rootConfig.uniqueId + '_' + d.index;

            // Fadeout conflicting elements
            // Code borrowed from http://bl.ocks.org/jsl6906/2554902
            var selectedLabelLeft = d3.select(llId).node().getBBox();
            var selectedValueLeft = d3.select(lvId).node().getBBox();
            var selectedLabelRight = d3.select(rlId).node().getBBox();
            var selectedValueRight = d3.select(rvId).node().getBBox();

            var f = 0.7;
            var hoverOpacityClosedObjects = .2;

            // Left Label Collision Detection
            var closeLabelLeft = d3.selectAll(selector + ' svg text.d3sg.tl.left').filter(function (g) {
                var compareLeft = d3.select(this)[0][0].getBBox();
                if (Math.abs(compareLeft.y - selectedLabelLeft.y) <= selectedLabelLeft.height * f && d != g) { return true; }
            });
            closeLabelLeft.transition().duration(100).style("opacity", hoverOpacityClosedObjects);

            // Left Value Collision Detection
            var closeValueLeft = d3.selectAll(selector + ' svg text.d3sg.v.left').filter(function (g) {
                var compareLeft = d3.select(this)[0][0].getBBox();
                if (Math.abs(compareLeft.y - selectedValueLeft.y) <= selectedValueLeft.height * f && d != g) { return true; }
            });
            closeValueLeft.transition().duration(100).style("opacity", hoverOpacityClosedObjects);

            // Right Label Collision Detection
            var closeLabelRight = d3.selectAll(selector + ' svg text.d3sg.tl.right').filter(function (g) {
                var compareRight = d3.select(this)[0][0].getBBox();
                if (Math.abs(compareRight.y - selectedLabelRight.y) <= selectedLabelRight.height * f && d != g) { return true; }
            });
            closeLabelRight.transition().duration(100).style("opacity", hoverOpacityClosedObjects);

            // Right Value Collision Detection
            var closeValueRight = d3.selectAll(selector + ' svg text.d3sg.v.right').filter(function (g) {
                var compareRight = d3.select(this)[0][0].getBBox();
                if (Math.abs(compareRight.y - selectedValueRight.y) <= selectedValueRight.height * f && d != g) { return true; }
            });
            closeValueRight.transition().duration(100).style("opacity", hoverOpacityClosedObjects);

          
            // Left Value & Label
            d3.selectAll(lvId).classed("over", true)
            d3.selectAll(llId).classed("over", true)

            // Line
            d3.selectAll(strokeId).classed("over", true);

            // Right Value & Label
            d3.selectAll(rvId).classed("over", true)
            d3.selectAll(rlId).classed("over", true)

            // Tooltip
            var toolTipYOffSet = 20;
            divTooltip.transition()
                .duration(200)
                .style('opacity', .99)
                .style('display', 'block');
            var trend = d.left > d.right ? '&#8595;' : (d.left < d.right ? '&#8593;' : '&#8596;');
            divTooltip.html("<div class='d3sg_tt_label'>" + d.label + "</div><table class='d3sg_tt_table'><tr><td class='d3sg_tt_table_headerCol'>" + (rootConfig.y1 === '' ? 'Left' : rootConfig.y1) + ":</td><td class='d3sg_tt_table_contentCol'>" + d.left + "<td></tr><tr><td class='d3sg_tt_table_headerCol'>" + (rootConfig.y2 === '' ? 'Left' : rootConfig.y2) + ":</td><td class='d3sg_tt_table_contentCol'>" + d.right + "</td></tr><tr><td class='d3sg_tt_table_headerCol'>Trend:</td><td class='d3sg_tt_table_contentCol d3sg_centered'><b>" + trend + '</b></td></tr></table>')
                .style('left', (d3.event.pageX) - leftOffset + 'px')
                .style('top', ((d3.event.pageY) - divTooltip.attr('height') - topOffset + toolTipYOffSet) + 'px');
        }

        function sectorOut(d) {

            //console.group('Sector Out');
            //console.log(d);
            //console.groupEnd();

            var strokeId = '#stroke_' + rootConfig.uniqueId + '_' + d.index;
            var lineId = '#line_' + rootConfig.uniqueId + '_' + d.index;
            var llId = '#ll_' + rootConfig.uniqueId + '_' + d.index;
            var lvId = '#lv_' + rootConfig.uniqueId + '_' + d.index;
            var rvId = '#rv_' + rootConfig.uniqueId + '_' + d.index;
            var rlId = '#rl_' + rootConfig.uniqueId + '_' + d.index;

            // Tooltip
            divTooltip.transition()
                .duration(200)
                .style('opacity', 0)
                .style('display', 'none');

            // Left Value & Label
            d3.selectAll(lvId).classed("over", false);
            d3.selectAll(llId).classed("over", false);

            // Line
            d3.selectAll(strokeId).classed("over", false);

            // Right Value & Label
            d3.selectAll(rvId).classed("over", false);
            d3.selectAll(rlId).classed("over", false);

            // Show conflicting elements again (right and left)
            d3.selectAll(selector + ' svg text.d3sg.tl').transition().duration(100).style("opacity", 1);
            d3.selectAll(selector + ' svg text.d3sg.v').transition().duration(100).style("opacity", 1);


            
        }
    };

    // http://jsfiddle.net/stefanwalther/XVP2Z/
    function makeid(len) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < len; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

}


'use strict';

angular.module('myApp', ['ui.router', 'mms', 'mms.directives', 'fa.directive.borderLayout', 'ui.bootstrap', 'ui.tree', 'angular-growl'])
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('doc', {
        url: '/workspaces/:ws/sites/:site/products/:docId/:time',
        resolve: {
            document: function($stateParams, ElementService) {
                return ElementService.getElement($stateParams.docId, false, $stateParams.ws, $stateParams.time);
            },
            site: function($stateParams, SiteService) {
                return SiteService.getSite($stateParams.site);
            },
            views: function($stateParams, ViewService) {
                return ViewService.getDocumentViews($stateParams.docId, false, $stateParams.ws, $stateParams.time);
            },
            time: function($stateParams) {
                return $stateParams.time;
            },
            snapshots: function($stateParams, ConfigService) {
                return ConfigService.getProductSnapshots($stateParams.docId, $stateParams.site, $stateParams.ws);
            },
            ws: function($stateParams) {
                return $stateParams.ws;
            }
        },
        views: {
            'menu': {
                template: '<mms-nav mms-site="{{site}}" mms-title="{{title}}" mms-type="View Editor" mms-ws="{{ws}}"></mms-nav>',
                //template: '<mms-nav site="{{site}}" type="document"></mms-nav>',
                controller: function($scope, $stateParams, document, site, ws) {
                    $scope.site = site.name;
                    $scope.ws = ws;
                    if ($stateParams.time !== 'latest')
                        $scope.title = document.name + ' (' + $stateParams.time + ')';
                    else
                        $scope.title = document.name;
                    $scope.docweb = false;
                }
            },
            'sidebar-left': {
                templateUrl: 'partials/ve/sidebar-left.html',
                controller: 'NavTreeCtrl'
            },
            'toolbar': {
                template: '<mms-toolbar buttons="buttons" on-click="onClick(button)" mms-tb-api="tbApi"></mms-toolbar>',
                controller: 'ToolbarCtrl'
            },
            'sidebar-right': {
                templateUrl: 'partials/ve/sidebar-right.html',
                controller: 'ToolCtrl'
            }
        }
    })
    .state('doc.view', {
        url: '/view/:viewId',
        views: {
            'view@': {
                templateUrl: 'partials/ve/view.html',
                controller: 'ViewCtrl'
            }
        },
        resolve: {
            viewElements: function($stateParams, ViewService, time, ws) {
                return ViewService.getViewElements($stateParams.viewId, false, ws, time);
            }
        }
    })
    .state('doc.order', {
        url: '/order',
        views: {
            'view@': {
                templateUrl: 'partials/ve/reorder-views.html',
                controller: 'ReorderCtrl'
            }
        }
    });
});

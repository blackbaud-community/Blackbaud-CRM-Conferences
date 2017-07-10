
(function () {
  'use strict';


angular.module('skytutorial')
    .controller('ConstituentListController', ['bbuiShellService', '$scope', '$q','bbMoment', function (bbuiShellService, $scope, $q,bbMoment) {

        var self = this,
            svc = bbuiShellService.create();

        $scope.submit = function searchConstituents(constituentQuickFindText) {
            self.constituents = [];

            svc.searchListQuickFind("23C5C603-D7D8-4106-AECC-65392B563887", constituentQuickFindText, { onlyReturnRows: true })
                .then(function (response) {
                    response.data.rows.forEach(function (row) {
                        if (row.values[9] === "Individual") {
                            self.constituents.push({
                                id: row.values[0],
                                fullName: row.formattedValues[1],
                                addressBlock: row.formattedValues[2],
                                city: row.formattedValues[3],
                                zip: row.formattedValues[4]
                            });
                        }
                    });
                })
                .catch(function () {
                    console.warn("Failed to search");
                })
        }

    }]);
    
}());
var serverUrl = 'https://cydupqgzpx:p19ndm9l1a@realtrends-9107882958.eu-west-1.bonsai.io/building_data/_search?';
var searchIndex = 'elasticsearch';

jQuery(document).ready(function($) {
  $('.facet-view-simple').facetview({
    search_url: serverUrl,
    search_index: searchIndex,
    initialsearch: true,
    facets: [
      {'field': 'site_pcode', 'display': 'Site Postcode'},
      {'field': 'Building_classification_1', 'display': 'Building Classification'},
      {'field': 'dwellings_before_work', 'display': '#Before'},
      {'field': 'dwellings_after_work', 'display': '#After'},
      {'field': 'number_demolished', 'display': 'Demolished?'}
    ],
    paging: {
      size: 10
    },
    on_results_returned: function(sdata) {
      console.log(sdata);
    }
  });
});
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
    },
    searchwrap_start: '<table class="table table-striped table-bordered" id="facetview_results"><thead><tr><td></td><th>Site Street</th><th>Site Suburb</th><th>Site Postcode</th><th>Site Geocode</th></tr></thead><tbody>',
    searchwrap_end: '</tbody></table>',
    result_display: [
                [
                    {
                        "pre": "<td>",
                        "field": "event_date",
                        "post": "</td>"
                    },
                    {
                        "pre": "<td>",
                        "field": "state",
                        "post": "</td>"
                    },
                    {
                        "pre": "<td>",
                        "field": "area",
                        "post": "</td>"
                    },
                    {
                        "pre": "<td>",
                        "field": "lga_name",
                        "post": "</td>"
                    },
                    {
                        "pre": "<td>",
                        "field": "offense_category",
                        "post": "</td>"
                    },
                    {
                        "pre": "<td>",
                        "field": "subcategory",
                        "post": "</td>"
                    },
                    {
                        "pre": "<td>",
                        "field": "t_count",
                        "post": "</td>"
                    }
                ]
            ],
  });
});
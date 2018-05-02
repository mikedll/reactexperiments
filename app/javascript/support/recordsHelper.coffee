import { getUrlParameter } from 'support/urlHelper';

class RecordsHelper
  constructor: (@isPlural, @props) ->
  getBootstrapped: () ->
    key =  if @isPlural then 'query_result' else 'record'
    @props[key]

  pageFromQuery: () ->
    pPage = parseInt(getUrlParameter('page'));
    if (pPage == null || isNaN(pPage)) then 1 else pPage;

  needsFetch: (queryResult, page) ->
    !queryResult? || page != queryResult.info.page

  fetchPage: (path, page, success) ->
    $.ajax({
      url: path
      data: { page: page }
      dataType: 'JSON'
      success: success
    })

export { RecordsHelper }

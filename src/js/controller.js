import * as model from './model.js';
import recipeView from './views/recipeView.js';
import SearchView from './views/SearchView.js';
import ResultsView from './views/resultsView.js';
import PaginationView from './views/paginationView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

if (module.hot) {
  module.hot.accept();
}

const showRecipe = async function () {
  try {
    // resultsView.renderSpinner();
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0. results view to mark selected search result
    resultsView.update(model.getSeachRultsPage());
    bookmarksView.update(model.state.bookmarks);
    //1. Loading recipe Data from API
    //does not return anything, only manipulates data
    //do not need to store in variable
    await model.loadRecipe(id);
    const { recipe } = model.state;
    console.log('here');

    // console.log(recipeContainer);
    console.log('after');
    //2. Rendering recipe

    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    //1. get search query
    const query = SearchView.getQuery();
    if (!query) return;

    //2. load search results
    //does not return anything, only manipulates data
    //do not need to store in variable
    await model.loadSearchResults(query);

    //3. render results
    // console.log( );
    // ResultsView.render(model.state.search.results);
    ResultsView.render(model.getSeachRultsPage());

    //4 render the initial pagination buttons
    PaginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1. render NEW results
  ResultsView.render(model.getSeachRultsPage(goToPage));

  //4 render NEW pagination buttons
  PaginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings
  model.updateServings(newServings);

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  //will only update text and asttributed in the DOM without
  // haing to rerender the entire view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1 add/ remove markmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2 update recipe view
  recipeView.update(model.state.recipe);

  //3 render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // render spinner
    addRecipeView.renderSpinner();

    //upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render new recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 2500);
  } catch (err) {
    console.error('🔮', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(showRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome!');
};
init();

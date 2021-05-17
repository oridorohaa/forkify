import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  parentElement = document.querySelector('.results');
  errorMessage =
    'Something is wrong. No recipe found for your query! Try again ';
  message = '';

  _generateMarkup() {
    return this.data.map(result => previewView.render(result, false)).join('');
  }
}
export default new ResultsView();

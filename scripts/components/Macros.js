import React from 'react';
import h from '../helpers.js';
import ReactMixin from 'react-mixin'
import MoreInfoMixin from '../MoreInfoMixin';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import autobind from 'autobind-decorator'; /* ES7 Autobind */
import UIElements from '../UIElements' // Sitewide Customized UI Elements
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

@autobind
class Macros extends React.Component{
  constructor(){
    super();
    this.state = {
      macroDesc : null,
      highlightIdx: 0
    };
  }

  /* Shorten calls to linkState */
  ls(id){
    return this.props.linkState('user.' + id);
  }

  /* Provide link to additional info for Plans */
  getPlanSourcePage(plan){
    switch (plan) {
      case 'lg':
        return ['The LeanGains Guide', 'http://rippedbody.jp/leangains-intermittent-fasting-guide-how-to-do-it-by-yourself/'];
        break;
      case 'lb':
        return ['The Lean Body Overview', 'http://www.bodybuilding.com/fun/lee-labrada-12-week-lean-body-trainer-nutrition-overview.html'];
        break;
      case 'primal':
        return ['The Definitive Guide to Primal Eating', 'http://www.marksdailyapple.com/definitive-guide-to-the-primal-eating-plan/'];
      case 'anabolic':
        return ['The Definitive Anabolic Diet Guide', 'http://stronglifts.com/anabolic-diet-101-the-definite-anabolic-diet-guide/'];
        break;
      case 'iifym':
        return ['The Flexible Dieting Guide',
        'http://www.simplyshredded.com/flexible-dieting.html'];
        break;
      default:
        return null;
    }
  }

  /* Plan Overview */
  getHighlights(plan){
    switch (plan) {
      case 'lg':
        return {
          diet: <ul>
            <li>Carb cycling - Save carbs for training days</li>
            <li>Intermittent Fasting - Fast 16hrs/day</li>
          </ul>,
          training: <ul>
            <li>Lift heavy 3x per week</li>
            <li>ex. Stronglifts 5x5, Big 3</li>
            <li>Optional Cardio - 30 mins post-workout</li>
            <li>Optional weighted accessory exercises</li>
          </ul>
        }
        break;
      case 'lb':
        return {
          diet: <ul>
            <li>Protein - 1g/lb&nbsp;&nbsp;&nbsp;Carbs - 1.5g/lb</li>
            <li>Use fat to adjust calories</li>
            <li>Eat whole, raw foods. Cheat meal 1-2x/week</li>
            <li>Avoid processed/refined or sugary foods.</li>
          </ul>,
          training: <ul>
            <li>Cycle - Lift 2 days then 1 active rest day</li>
            <li>30 mins HIIT cardio on rest days + back/bi days</li>
            <li>Stimulate don't annihilate</li>
          </ul>
        }
        break;
      case 'primal':
        return {
          diet: <ul>
            <li>Protein - 1g/lb&nbsp;&nbsp;&nbsp;Carbs - 80g</li>
            <li>Keep carbs &lt; 150g, &lt; 80g for fat loss</li>
            <li>Eat lots of whole, raw foods. 80/20 Rule</li>
            <li>Avoid processed/refined or sugary foods.</li>
          </ul>,
          training: <ul>
            <li>Lift heavy 2-3x per week</li>
            <li>Sprint 1-2x per week</li>
            <li>Move slowly 2+ hours per week</li>
            <li>Don't be a slug</li>
          </ul>
        }
        break;
      case 'anabolic':
        return {
          diet: <ul>
            <li>5 Days - Extremely low carb</li>
            <li>2 Days - Carb refeed</li>
          </ul>,
          training: <ul>
            <li>Lift heavy at least 3x per week</li>
            <li>ex. Stronglifts 5x5, Big 3</li>
            <li>Optional Cardio - 30 mins post-workout</li>
          </ul>
        }
        break;
      case 'iifym':
        return {
          diet: <ul>
            <li>Protein - 1g/lb&nbsp;&nbsp;&nbsp;Fat - .45g/lb</li>
            <li>14g of fiber per 1000 calories</li>
            <li>Eat mostly healthy foods</li>
            <li>Focus on hitting macro goals</li>
          </ul>,
          training: <ul>
            <li>Lift heavy 2-3x per week</li>
            <li>Sprint 1-2x per week</li>
          </ul>
        }
        break;
      case 'tailored':
        return {
          'Diet Tips': <ul>
            <li>Protein .75g-2g/lb of bodyweight</li>
            <li>14g of fiber per 1000 calories</li>
            <li>Eat mostly healthy foods</li>
          </ul>,
          'Training Tips': <ul>
            <li>Lift heavy 3x per week</li>
            <li>Sprint 1-2x per week</li>
            <li>Be Active</li>
          </ul>
        }
        break;
      default:
        return null;
    }
  }

  showMacros(titles){
    var user = this.props.user;
    if(user.plan == ""){
      return UIElements.UIMessage({coloredMsg: 'plan', plainMsg: 'required', colorClass: 'red'})
    }

    var td = user.macros.t; // Training Day Macros
    var rd = user.macros.r; // Rest Day Macros

    var unit = 'g';
    var min = 0;
    var max = 999;
    var type = 'number';
    var readOnly = user.macro_mode == '%' || user.plan != 'tailored';
    var onFocus = readOnly ? h.blur : '';
    var addClasses = ' green';
    var defOpts = {unit: unit, min: min, max: max, type: type, readOnly: readOnly, addClasses: addClasses, onFocus: onFocus, divSizeClass: ''};

    /* Display Macro sections only if a titles are provided */
    var d1 = titles.t1 ? (
      <div className='macro_half1 divIL half'>
        <h4>{titles.t1}</h4>
        <div className='divIL third'>
          {UIElements.UIInput(h.extend(defOpts, {
            valLink: this.ls('macros.r.p'),
            label: 'Protein',
            id: 'protein',
            placeholder: 0,
            addClasses: (readOnly ? ' green' : ' blue')
          }))}
        </div>
        <div className='divIL third'>
          {UIElements.UIInput(h.extend(defOpts, {
            valLink: this.ls('macros.r.f'),
            label: 'Fat',
            id: 'fat',
            placeholder: 0,
            addClasses: (readOnly ? ' green' : ' blue')
          }))}
        </div>
        <div className='divIL third'>
          {UIElements.UIInput(h.extend(defOpts, {
            valLink: this.ls('macros.r.c'),
            label: 'Carbs',
            id: 'carbs',
            placeholder: 0,
            readOnly: true,
            addClasses: ' green',
            onFocus: h.blur
          }))}
        </div>
      </div>
    ) : null;

    readOnly = user.macro_mode == '%' || user.plan != 'tailored';
    onFocus = readOnly ? h.blur : '';
    defOpts = {unit: unit, min: min, max: max, type: type, readOnly: readOnly, addClasses: addClasses, onFocus: onFocus, divSizeClass: ''};

    var d2 = titles.t2 ? (
      <div className='macro_half2 divIL half'>
        <h4>{titles.t2}</h4>
        <div className='divIL third'>
          {UIElements.UIInput(h.extend(defOpts, {
            valLink: this.ls('macros.t.p'),
            label: 'Protein',
            id: 'protein',
            placeholder: 0,
            addClasses: (readOnly ? ' green' : ' blue')
          }))}
        </div>
        <div className='divIL third'>
          {UIElements.UIInput(h.extend(defOpts, {
            valLink: this.ls('macros.t.f'),
            label: 'Fat',
            id: 'fat',
            placeholder: 0,
            addClasses: (readOnly ? ' green' : ' blue')
          }))}
        </div>
        <div className='divIL third'>
          {UIElements.UIInput(h.extend(defOpts, {
            valLink: this.ls('macros.t.c'),
            label: 'Carbs',
            id: 'carbs',
            placeholder: 0,
            addClasses: ' green',
            onFocus: h.blur
          }))}

        </div>
      </div>
    ) : null;

    /* Provide link to detailed Plan information */
    var planSource = this.getPlanSourcePage(user.plan);
    if(planSource){
      planSource = (<p className='planSource'>For more info visit <a className='planLink' href={planSource[1]} target='_blank'>{planSource[0]}</a></p>);
    }

    return(
      <div id='macroDisplay'>
        {planSource}
        {d1}
        {d2}
      </div>
    )
  }

  /* Show the highlight component */
  showHighlight(index, highlights, id){
    return (
      <div className='highlight' id={'highlight_' + id}>
        <div onClick={this.nextHighlight.bind(this, false)} className='navBack'>&lt;</div>
        {this.makeHighlight(index, highlights)}
        <div onClick={this.nextHighlight.bind(this, true)} className='navForward'>&gt;</div>
      </div>
    );
  }
  /* Create the innards for showHighlight */
  makeHighlight(index, highlights){
    var key = this.getKey(index, highlights);
    var next = index + 1;
    return (
      <div className='highlight_mid' id={'highlight_' + key} >
        <h4>{key.capitalize()}</h4>
        {highlights[key]}
      </div>
    );
  }
  /* Update state with new highlight index */
  nextHighlight(forward=true){
    var maxIdx = Object.keys(this.getHighlights(this.props.user.plan)).length - 1;
    var newVal = this.state.highlightIdx + (forward ? 1 : -1);
    this.setState({
      highlightIdx: (newVal < 0 ? maxIdx : newVal)
    });
  }

  getKey(idx, obj){
    var keys = Object.keys(obj);
    idx = idx % (keys.length) || 0;
    return keys[idx];
  }

  getIndex(key, obj){
    return Objects.keys(obj).indexOf(key);
  }

  UIInput(opts){
    return UIElements.UIInput(opts);
  }

  /* Switch to the alternate macro mode */
  toggleMacroMode(e){
    e.preventDefault();
    switch(this.props.user.macro_mode){
      case '%':
        this.props.user.macro_mode = 'g';
        break;
      case 'g':
        this.props.user.macro_mode = '%';
      default:
    }
    h.toggleClass({find_id: 'macro_modep', toggle_class:'blue'});
    h.toggleClass({find_id: 'macro_modeg', toggle_class:'blue'});
    this.setState({update: true });
  }

  /* Display a toggle switch for macro mode */
  showMacroModes(){
    var user = this.props.user;
    var classg = 'macroModeButton' + (user.macro_mode == 'g' ? ' blue' : '');
    var classp = 'macroModeButton' + (user.macro_mode == '%' ? ' blue' : '');
    return (
    <div id='macroMode'>
      {/*<h4>Mode</h4>*/}
      <input id='macro_modep' type='button' value='%' onClick={this.toggleMacroMode} className={classp}/>
      <input id='macro_modeg' type='button' value='g' onClick={this.toggleMacroMode} className={classg}/>
    </div>
    )
  }

  /* Display Input Fields for Custom Macro Percentage */
  showTailoredInputs(){
    var user = this.props.user;
    if(user.plan !=  'tailored'){
      return null;
    }
    var macroMode = this.props.user.macro_mode;
    var unit = '%';
    var min = 0;
    var max = 100;
    var defOpts = {unit: unit, min: min, max: max, type: 'number', divSizeClass: 'third'};
    if(user.macro_mode == 'g'){
      // Customize Macros Directly
      return (
        <div>
          {this.showMacroModes()}
        </div>
      )
    } else {
      // Enter Custom Percentages
      return (
        <div>
          {this.showMacroModes()}
          <div className='ti'>
            {UIElements.UIInput(h.extend(defOpts, {
              valLink: this.ls('macros.p.p'),
              label: 'Protein',
              id: 'protein',
              placeholder: 0
            }))}
            {UIElements.UIInput(h.extend(defOpts, {
              valLink: this.ls('macros.p.f'),
              label: 'Fat',
              id: 'fat',
              placeholder: 0
            }))}
            {UIElements.UIInput(h.extend(defOpts, {
              value: 100 - user.macros.p.p - user.macros.p.f,
              valLink: null,
              label: 'Carbs',
              id: 'carbs',
              disabled: true
            }))}*
          </div>
        </div>
      )
    }
  }

  render(){
    var user = this.props.user;
    if(user.goal == "" || user.activity == "" || typeof(user.bmr) == "string"){
      /* Hide component if prerequisite info is not provided */
      return null
    }
    var highlights = this.getHighlights(user.plan);
    var macroInfoText =
    (<div>
      Macronutrients are the 'big picture' targets for your diet. Hitting each of your macros will keep you near your daily carlorie target, as set by your Goal. Counting macros, versus just calories, helps guide your intake toward more protein, fat or carbs in order to better support your energy needs for the day. Note that it's important to eat a variety of healthy foods to also meet your body's daily micronutrient needs, no matter what plan you choose.
      <ul>
        <li>Use <span className='bold'>Custom > Mode > %</span> to specify your own macro breakdown by percentages.</li>
        <li>Use <span className='bold'>Custom > Mode > g</span> in order to enter your own macros in grams.</li>
      </ul>
     </div>);

    return (
      <CSSTransitionGroup
        component='div'
        className='subCompTg'
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}
        transitionAppearTimeout={1000}
        transitionName='subcomp'
        transitionAppear={true}>
      <div key='macrosComp' id='macros' className='subcomponent'>
        <h1>Macros {this.addInfoButton('macroDesc', macroInfoText, '', '')}</h1>
        <CSSTransitionGroup
          component='div'
          className='tg'
          transitionEnterTimeout={100}
          transitionLeaveTimeout={100}
          transitionName='info' >
          {this.state.macroDesc}
        </CSSTransitionGroup>
        <select selected="" id="plan" valueLink={this.ls('plan')}>
          <option value="">Select A Plan</option>
          <option value="primal">Primal</option>
          <option value="anabolic">Anabolic</option>
          <option value="lg">LeanGains</option>
          <option value="iifym">IIFYM</option>
          <option value="lb">Lean Body</option>
          <option value="tailored">Custom</option>
        </select>
        <br/>
        {highlights ? this.showHighlight(this.state.highlightIdx, highlights, 'macros') : null}
        {this.showTailoredInputs()}
        {this.showMacros(h.getTitles(this.props.user.plan))}
      </div>
      </CSSTransitionGroup>
    );
  }
}

ReactMixin.onClass(Macros, MoreInfoMixin);
export default Macros;

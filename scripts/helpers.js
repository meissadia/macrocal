import React from 'react';

let helpers =  {
  /* Check if value is a number */
  isNumber : function(n){
    return Number(n) == n;
  },
  /* Round value to 2 decimal places */
  round2Dec : function(num){
    return Math.round(num*100)/100;
  },
  /* Convert Pounds to Kilograms */
  lbsToKg : function(lbs){
    return lbs * 0.453592;
  },
  /* Calculate height in Centimeters */
  heightCm : function(h_ft, h_in){
    return 2.54 * (this.heightIn(h_ft,h_in));
  },
  /* Calculate height in Inches */
  heightIn : function(h_ft, h_in){
    return (parseInt(h_ft) * 12) + parseInt(h_in)
  },
  /* Generate an HTML Option based on inputs */
  renderOption : function(prefix, option_value){
    return (
      <option value={option_value} key={option_value + "_" + prefix}>
        {option_value + " " + prefix}
      </option>
    );
  },
  /* Generate a range of values */
  generateRange : function(start, end){
    var vals = []
    for(start; start <= end; start++){
      vals.push(start);
    }
    return vals;
  },
  /* Percentages to object */
  pct2obj : function(low,high){
    // console.log('pct2obj d-> l:' + low + ' h: ' + high + ' ->' +  Math.round((low+high)/2).toString());
    return { l : low, h : high, d : Math.round((parseInt(low)+parseInt(high))/2.0) }
  },
  /* Percentage as text for display */
  pct2text : function(p){
    return (<span>{Math.round(p)} <span className='pct_sign'>%</span></span>);
  },
  /* Document Element search by ID */
  getElement : function(key){
    return document.getElementById(key);
  },
  /* Section Titles for Goals/Macros */
  getTitles : function(plan){
    var decoreBefore = "";
    var decoreAfter = "";
    switch (plan) {
      case 'anabolic':
        return {t1:decoreBefore + '2 Days' + decoreAfter, t2:decoreBefore + '5 Days' + decoreAfter};
        break;
      case 'primal':
      case 'lg':
        return {t1:decoreBefore + 'Rest Day' + decoreAfter, t2:decoreBefore + 'Training Day' + decoreAfter};
        break;
      case 'iifym':
      case 'lb':
        return {t1:decoreBefore + 'Daily' + decoreAfter, t2: null};
        break;
      default:
        return {t1:decoreBefore + 'Split 1' + decoreAfter, t2: decoreBefore + 'Split 2' + decoreAfter}
    }
  },

  /* Toggle assignment of a class to an element */
  toggleClass(opts){
    var find_id = opts.find_id;
    var find_class = opts.find_class;
    var toggle_class = opts.toggle_class;
    if(find_id){
      var element = document.getElementById(find_id);
    } else if(find_class){
      var element = document.getElementsByClassName(find_class)[0];
    }
    element.className.indexOf(toggle_class) > 0
      ? element.className = element.className.replace(toggle_class,'')
      : element.className = element.className + ' ' + toggle_class;
  },

  /* Assign a class to an element */
  addClass : function(opts){
    var find_id = opts.find_id;
    var find_class = opts.find_class;
    var add_class = opts.add_class;
    if(find_id){
      var element = document.getElementById(find_id);
    } else if(find_class){
      var element = document.getElementsByClassName(find_class)[0];
    }
    element.className.indexOf(add_class) < 0
      ? element.className = element.className + ' ' + add_class
      : element.className = element.className.replace(add_class,'');
  },

  /* Extend obj with attributes of src */
  extend : function(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
  },

  blur(){
    document.activeElement.blur();
  }
}

export default helpers;

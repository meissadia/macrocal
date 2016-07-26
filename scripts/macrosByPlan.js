let mbp =  {
  /* Calculate Macros for Plan: Primal */
  calcPrimal : function(calories, weight){
    var protein = parseInt(weight);
    var carbs = 80;
    var fat = Math.round((calories - (protein * 4) - (carbs * 4))/9);
    return { p: protein, f: fat, c: carbs };
  },

  /* Calculate Macros for Plan: Anabolic */
  calcAnabolic : function(calories, weight, day){
    if(day == 2){
      var c_pct = .60;
      var f_pct = .25;
      var p_pct = .15;
    } else {
      var c_pct = (25 * 4) / calories;
      var f_pct = 0.6-(0.5 * c_pct);
      var p_pct = 0.4-(0.5 * c_pct);
    }
    var fat = Math.round((f_pct * calories) / 9);
    var carbs = Math.round((c_pct * calories) / 4);
    var protein = Math.round((p_pct * calories) / 4);
    return { p: protein, f: fat, c: carbs };
  },

  /* Calculate Macros for Plan: LeanGains */
  calcLeanGains : function(calories, weight, day){
    var protein = parseInt(weight);
    var fat = 50;
    if(day == 'r'){
      fat = Math.round(((calories - (protein * 4)) * .75) / 9);
    }
    var carbs = Math.round((calories - (protein * 4) - (fat * 9))/4);
    return { p: protein, f: fat, c: carbs };
  },

  /* Calculate Macros for Plan: If It Fits Your Macros */
  calcIIFYM : function(calories, weight){
    var protein = parseInt(weight);
    var fat = Math.round(.45 * protein);
    var carbs = Math.round((calories - (protein * 4) - (fat * 9))/4);
    return { p: protein, f: fat, c: carbs };
  },

  /* Calculate Macros for Plan: Lebrada LeanBody */
  calcLeanBody : function(calories, weight){
    var protein = parseInt(weight);
    var carbs = Math.round(protein * 1.5);
    var fat = Math.round((calories - (protein * 4) - (carbs * 4))/9);
    return { p: protein, f: fat, c: carbs };
  },

  /* Adjust for Steady Daily Intake */
  dailyPlan : function(user){
    user.pcts.l = user.pcts.d;
    user.calsLow = Math.round(user.tdee + (user.tdee * (parseInt(user.pcts.l) / 100.0)));
    return user;
  },

  /* Calculate Macros based on user percentages */
  calcTailored : function(calories, pcts){
    var protein = Math.round(((pcts.p / 100) * calories) / 4);
    var fat = Math.round(((pcts.f / 100) * calories ) / 9) ;
    var carbs = Math.round((calories - (protein * 4) - (fat * 9))/4);
    return { p: protein, f: fat, c: carbs };
  },

  calcCarbsRemaining : function(calories, protein, fat){
    return Math.round((calories - (protein * 4) - (fat * 9))/4); 
  }
}

export default mbp;

export function rating(avaliacao) {
    const total = avaliacao ? avaliacao.length : 0;
    var oneStar = 0;
    var twoStar = 0;
    var threeStar = 0;
    var fourStar = 0;
    var fiveStar = 0;
    if(avaliacao?.length > 0){
        for (let a = 0; a < avaliacao.length; a++) {
            const element = avaliacao[a];
            console.log('dsadasd', element)
            if(element.nota === 1){
                oneStar = oneStar += element.nota
            }
            if(element.nota === 2){
                twoStar = twoStar += element.nota
            }
            if(element.nota === 3){
                threeStar = threeStar += element.nota
            }
            if(element.nota === 4){
                fourStar = fourStar += element.nota
            }
            if(element.nota === 5){
                fiveStar = fiveStar += element.nota
            }
        }

        var oneTotal = oneStar * 1;
        var twoTotal = twoStar * 2;
        var threeTotal = threeStar *3
        var fourTotal = fourStar * 4;
        var fiveTotal = fiveStar * 5;

        var totalClicks = (oneStar + twoStar + threeStar + fourStar + fiveStar);
        var totalStars = (oneTotal + twoTotal + threeTotal + fourTotal + fiveTotal);
        var avgStars = (totalStars/totalClicks);
        
        avgStars = avgStars.toPrecision(3);

        console.log('oneStar', avgStars)
        return avgStars
    }
}
// function Calculate(){

//     var oneStar = +document.getElementById('one').value;
//     var twoStar = +document.getElementById('two').value;
//     var threeStar = +document.getElementById('three').value;
//     var fourStar = +document.getElementById('four').value;
//     var fiveStar = +document.getElementById('five').value;
  
//     var oneTotal = oneStar * 1;
//     var twoTotal = twoStar * 2;
//     var threeTotal = threeStar *3
//     var fourTotal = fourStar * 4;
//     var fiveTotal = fiveStar * 5;
  
//     var totalClicks = (oneStar + twoStar + threeStar + fourStar + fiveStar);
//     var totalStars = (oneTotal + twoTotal + threeTotal + fourTotal + fiveTotal);
//     var avgStars = (totalStars/totalClicks);
    
//     avgStars = avgStars.toPrecision(3);
    
//     if(avgStars.toString().split(".")[1]==0)
//       avgStars = Number(avgStars).toPrecision(1);
  
//     var stars = '&#9733;';
//     document.getElementById('resultTitle').style.display = 'block';
//     document.getElementById('roundp').style.display = 'block';
//     document.getElementById('avg').innerHTML = avgStars;
    
//     for(var i = 0 ;i<(Math.round(avgStars))-1;i++)
//     {
//       stars=stars+' &#9733;';
//     }
//     document.getElementById('round').innerHTML = stars;
//   }
  
//   function Clear(){
//     document.getElementById('one').value=81;
//     document.getElementById('two').value=87;
//     document.getElementById('three').value=43;
//     document.getElementById('four').value=55;
//     document.getElementById('five').value=34;
//     document.getElementById('avg').innerHTML = "";
//     document.getElementById('round').innerHTML = "";
//     document.getElementById('resultTitle').style.display = 'none';
//     document.getElementById('roundp').style.display = 'none';
//   }
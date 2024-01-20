class Game{
    constructor(){
		this.board = Array.from(Array(12), _ => Array(12).fill(0));
		this.x = 0;
		this.y = 0;
		this.direction = 0;
		this.isEmpty = false;
		this.letter = "";
		this.num = 0;
		this.lengthTotal = 0;
		this.livesTotal = 0;
		this.lives = this.livesTotal;
		this.results = [];
		this.startTime = 0;
		this.endTime = 0;
		this.time = 0;
		this.loadResults();
		this.getName();
		//this.showShips();
    }
	
	loadResults(){
        $.get("results.txt", (data) => {
            let content = JSON.parse(data).content;
            this.results = content;
        });
    }
	
	getName(){
		$('#submitName').click(()=>{
			this.name= $('#nameValue').val();
			if (this.name){
				$('.name').hide();
				$(".info").show();
				this.startGame();
			} else {
				$('#nameError').show();
			}	
		})
	}
	
	startGame(){
		$('#newGame').off("click");
		$('#newGame').hide();
		$("#notification").text("");
		this.loadResults();
		this.clearBoard();
		this.drawBoats();
        this.startTime = performance.now();
		this.listenToClicks();	
        this.showResults();
    }
	
	clearBoard(){
		
		this.board = Array.from(Array(12), _ => Array(12).fill(0));
		
		for(let i=0;i<10;i++){
			for(let j=0;j<10;j++){				
				$("#"+this.returnID(i, j)).css("background-color","white");
			}
		}
		
		for(let i=0; i<4;i++){
			$("#boat"+(i+1)).text(0);
		}
		this.lengthTotal = 0;
		this.livesTotal = 40;//40
		this.lives = this.livesTotal;
		this.startTime = 0;
		this.endTime = 0;
		this.time = 0;
	}
	
	saveResults(){
        let result = {
            name: this.name,
            time: this.time,
			lives: this.lives
        }

        this.results.push(result);

        this.results.sort((a, b) =>  b.lives - a.lives ||  parseFloat(a.time) - parseFloat(b.time));	

        $.post('server.php', {save: this.results}).done(function(){
            console.log('Success');
        }).fail(function(){
            alert('FAIL');
        })

        this.showResults();
    }

    showResults(){
        $('#results').html("");
		$('#results').append('<div class="resultsTitle">Tulemused</div>');
        for(let i = 0; i < this.results.length; i++){
            if(i === 10){break;}
			if(this.results[i].lives===this.lives &&  this.results[i].time===this.time){
				$('#results').append('<div class="winner">'+ (i+1) + '. ' + this.results[i].name + ' / ' + this.results[i].lives + ' elu alles / aeg '+ this.results[i].time + '</div>');
			}else{
				$('#results').append('<div>'+ (i+1) + '. ' + this.results[i].name + ' / ' + this.results[i].lives + ' elu alles / aeg '+ this.results[i].time + '</div>');
			}
        }
    }
	
	

	listenToClicks(){
		for(let i=0;i<10;i++){
			for(let j=0;j<10;j++){			
				/* $("#"+this.returnID(i, j)).click(()=>{this.checkHit(i, j)}); */
				/* $("#"+this.returnID(i, j)).on("click", ()=>{this.checkHit(i, j)}); */
				$("#"+this.returnID(i, j)).one("click", ()=>{this.checkHit(i, j)});
			}
		}
	}
	
	stopListeningToClicks(){
		for(let i=0;i<10;i++){
			for(let j=0;j<10;j++){			
				$("#"+this.returnID(i, j)).off("click");				
			}
		}
	}
	
	
	
	checkHit(x, y){
		if(this.board[x+1][y+1]==0||this.board[x+1][y+1]==2){
			$("#"+this.returnID(x, y)).css("background-color","pink");
			
			$("#notification").text("Möödas! Kaotasid ühe elu");
			console.log(this.lives);
			this.lives--;
			console.log(this.lives);
			$("#livesNum").text(this.lives);
			
			if(this.lives==0){
				$("#notification").text("Kaotasid! Mäng läbi");
				this.stopListeningToClicks();
				$('#newGame').show();
				$('#newGame').on("click", ()=>{this.startGame()});				
			}
		}
 		if(this.board[x+1][y+1]==1){
			$("#"+this.returnID(x, y)).css("background-color","red");
			this.board[x+1][y+1]=3;
			this.lengthTotal++;
			$("#notification").text("Pihtas! Jätka samas vaimus");
			this.checkIfSunken(x+1, y+1);
		} 
	}

	checkIfSunken(x, y){
		let endCounter = 0;
		let length = 1;

		//ruutude kontroll
		if(this.board[x][y-1]!=1&&this.board[x][y+1]!=1&&this.board[x-1][y]!=1&&this.board[x+1][y]!=1){
			//üleval
			if(this.board[x][y-1]==2){
				endCounter++;
			}else if(this.board[x][y-1]==3){
				length++;
				if(this.board[x][y-2]==2){
					endCounter++;
				}else if(this.board[x][y-2]==3){
					length++;
					if(this.board[x][y-3]==2){
						endCounter++;
					}else if(this.board[x][y-3]==3){
						length++;
						if(this.board[x][y-4]==2){
							endCounter++;
						}				
					} 
				} 
			}
			
			//all
			if(this.board[x][y+1]==2){
				endCounter++;
			}else if(this.board[x][y+1]==3){
				length++;
				if(this.board[x][y+2]==2){
					endCounter++;
				}else if(this.board[x][y+2]==3){
					length++;
					if(this.board[x][y+3]==2){
						endCounter++;
					}else if(this.board[x][y+3]==3){
						length++;
						if(this.board[x][y+4]==2){
							endCounter++;
						}				
					} 
				} 
			}
			
			//vasakul
			if(this.board[x-1][y]==2){
				endCounter++;
			}else if(this.board[x-1][y]==3){
				length++;
				if(this.board[x-2][y]==2){
					endCounter++;
				}else if(this.board[x-2][y]==3){
					length++;
					if(this.board[x-3][y]==2){
						endCounter++;
					}else if(this.board[x-3][y]==3){
						length++;
						if(this.board[x-4][y]==2){
							endCounter++;
						}				
					} 
				} 
			}
			
			//paremal
			if(this.board[x+1][y]==2){
				endCounter++;
			}else if(this.board[x+1][y]==3){
				length++;
				if(this.board[x+2][y]==2){
					endCounter++;
				}else if(this.board[x+2][y]==3){
					length++;
					if(this.board[x+3][y]==2){
						endCounter++;
					}else if(this.board[x+3][y]==3){
						length++;
						if(this.board[x+4][y]==2){
							endCounter++;
						}				
					} 
				} 
			}			
		}
		if(endCounter==4){
			console.log("laev on põhjas");
			this.markBoatAsSunken(x, y);
			let abi =  parseInt($("#boat"+length).text());
			$("#boat"+length).text(abi+1);
			$("#notification").text("Pihtas-põhjas!");
		}
		
		if(this.lengthTotal==20){
			$("#notification").text("Võit!");
			this.endTime = performance.now();
			this.time = ((this.endTime-this.startTime)/1000).toFixed(2);
			this.saveResults();
			this.stopListeningToClicks();
			$('#newGame').show();
            $('#newGame').on("click", ()=>{this.startGame()});			
		}
	}			
	
	markSquareAsHit(x, y){
		$("#"+this.returnID(x-1, y-1)).css("background-color","black");
	}
	
	markBoatAsSunken(x, y){
		
		this.markSquareAsHit(x, y);
		
		//üleval
		if(this.board[x][y-1]==3){
			this.markSquareAsHit(x, y-1);
			if(this.board[x][y-2]==3){
				this.markSquareAsHit(x, y-2);
				if(this.board[x][y-3]==3){
					this.markSquareAsHit(x, y-3);				
				} 
			} 
		}
		
		//all
		if(this.board[x][y+1]==3){
			this.markSquareAsHit(x, y+1);
			if(this.board[x][y+2]==3){
				this.markSquareAsHit(x, y+2);
				if(this.board[x][y+3]==3){
					this.markSquareAsHit(x, y+3);				
				} 
			} 
		}
		
		//vasakul
		if(this.board[x-1][y]==3){
			this.markSquareAsHit(x-1, y);
			if(this.board[x-2][y]==3){
				this.markSquareAsHit(x-2, y);
				if(this.board[x-3][y]==3){
					this.markSquareAsHit(x-3, y);				
				} 
			} 
		}
		
		//paremal
		if(this.board[x+1][y]==3){
			this.markSquareAsHit(x+1, y);
			if(this.board[x+2][y]==3){
				this.markSquareAsHit(x+2, y);
				if(this.board[x+3][y]==3){
					this.markSquareAsHit(x+3, y);				
				} 
			} 
		}			
	}
	
/* 	showShips(){
		for(let i=0;i<10;i++){
			for(let j=0;j<10;j++){			
				if(this.board[i+1][j+1]==1){
					$("#"+this.returnID(i, j)).css("background-color","blue");				
				} 				
			}
		}
	} */

	returnID(x, y){
		const kood = 'a'.charCodeAt(0);
		this.letter = String.fromCharCode(x+kood);
		this.num=y+1;
 		return ""+this.letter+this.num;
	}
	
/* 	returnX(id){
		const kood = 'a'.charCodeAt(0)
		this.letter = id.substring(0,1);
		return this.letter.charCodeAt(0) - kood;
	}
	
	returnY(id){
		this.num = id.slice(1)-1;
		return this.num;
	} */
	
	drawBoats(){
		$("#totalLivesNum").text(this.livesTotal);
		$("#livesNum").text(this.lives);
		this.drawBoatOfFour();
		this.drawBoatOfThree();
		this.drawBoatOfThree();
		this.drawBoatOfTwo();
		this.drawBoatOfTwo();
		this.drawBoatOfTwo();
		this.drawBoatOfOne();
		this.drawBoatOfOne();
		this.drawBoatOfOne();
		this.drawBoatOfOne();
	}
	
	drawBoatOfFour(){
		let x = 0;
		let y = 0;
		let direction = 0;
		let isEmpty = false;
		while(!isEmpty){
			direction = Math.floor(Math.random() * 2);
			
			if(direction==0){
				x = 1+Math.floor(Math.random() * 10);
				y = 1+Math.floor(Math.random() * 7);
		
				if(this.board[x-1][y-1]!=1&&this.board[x-1][y]!=1&&this.board[x-1][y+1]!=1&&this.board[x-1][y+2]!=1&&this.board[x-1][y+3]!=1&&this.board[x-1][y+4]!=1&&this.board[x][y-1]!=1&&this.board[x][y]==0&&this.board[x][y+1]==0&&this.board[x][y+2]==0&&this.board[x][y+3]==0&&this.board[x][y+4]!=1&&this.board[x+1][y-1]!=1&&this.board[x+1][y]!=1&&this.board[x+1][y+1]!=1&&this.board[x+1][y+2]!=1&&this.board[x+1][y+3]!=1&&this.board[x+1][y+4]!=1){
					this.board[x-1][y-1]=2;
					this.board[x][y-1]=2;
					this.board[x+1][y-1]=2;
					this.board[x][y]=1;
					this.board[x-1][y]=2;
					this.board[x+1][y]=2;
					this.board[x][y+1]=1;
					this.board[x-1][y+1]=2;
					this.board[x+1][y+1]=2;
					this.board[x][y+2]=1;
					this.board[x-1][y+2]=2;
					this.board[x+1][y+2]=2;
					this.board[x][y+3]=1;
					this.board[x-1][y+3]=2;
					this.board[x+1][y+3]=2;
					this.board[x][y+4]=2;
					this.board[x-1][y+4]=2;
					this.board[x+1][y+4]=2;
					isEmpty=true;
					if(isEmpty){
						break;
					}
				}
			}
			
			if(direction==1){
				x = 1+Math.floor(Math.random() * 7);
				y = 1+Math.floor(Math.random() * 10);
				
				if(this.board[x-1][y-1]!=1&&this.board[x][y-1]!=1&&this.board[x+1][y-1]!=1&&this.board[x+2][y-1]!=1&&this.board[x+3][y-1]!=1&&this.board[x+4][y-1]!=1&&this.board[x-1][y]!=1&&this.board[x][y]==0&&this.board[x+1][y]==0&&this.board[x+2][y]==0&&this.board[x+3][y]==0&&this.board[x+4][y]!=1&&this.board[x-1][y+1]!=1&&this.board[x][y+1]!=1&&this.board[x+1][y+1]!=1&&this.board[x+2][y+1]!=1&&this.board[x+3][y+1]!=1&&this.board[x+4][y+1]!=1){
					this.board[x-1][y-1]=2;
					this.board[x-1][y]=2;
					this.board[x-1][y+1]=2;
					this.board[x][y]=1;
					this.board[x][y-1]=2;
					this.board[x][y+1]=2;
					this.board[x+1][y]=1;
					this.board[x+1][y-1]=2;
					this.board[x+1][y+1]=2;
					this.board[x+2][y]=1;
					this.board[x+2][y-1]=2;
					this.board[x+2][y+1]=2;
					this.board[x+3][y]=1;
					this.board[x+3][y-1]=2;
					this.board[x+3][y+1]=2;
					this.board[x+4][y]=2;
					this.board[x+4][y-1]=2;
					this.board[x+4][y+1]=2;
					isEmpty=true;
					if(isEmpty){
						break;
					}				
				}
			}
		}
		isEmpty = false;
	}
	
	drawBoatOfThree(){
		let x = 0;
		let y = 0;
		let direction = 0;
		let isEmpty = false;
		while(!isEmpty){
			direction = Math.floor(Math.random() * 2);
			
			if(direction==0){
				x = 1+Math.floor(Math.random() * 10);
				y = 1+Math.floor(Math.random() * 8);
		
				if(this.board[x-1][y-1]!=1&&this.board[x-1][y]!=1&&this.board[x-1][y+1]!=1&&this.board[x-1][y+2]!=1&&this.board[x-1][y+3]!=1&&this.board[x][y-1]!=1&&this.board[x][y]==0&&this.board[x][y+1]==0&&this.board[x][y+2]==0&&this.board[x][y+3]!=1&&this.board[x+1][y-1]!=1&&this.board[x+1][y]!=1&&this.board[x+1][y+1]!=1&&this.board[x+1][y+2]!=1&&this.board[x+1][y+3]!=1){
					this.board[x-1][y-1]=2;
					this.board[x][y-1]=2;
					this.board[x+1][y-1]=2;
					this.board[x][y]=1;
					this.board[x-1][y]=2;
					this.board[x+1][y]=2;
					this.board[x][y+1]=1;
					this.board[x-1][y+1]=2;
					this.board[x+1][y+1]=2;
					this.board[x][y+2]=1;
					this.board[x-1][y+2]=2;
					this.board[x+1][y+2]=2;
					this.board[x][y+3]=2;
					this.board[x-1][y+3]=2;
					this.board[x+1][y+3]=2;
					isEmpty=true;
					if(isEmpty){
						break;
					}
				}
			}
			
			if(direction==1){
				x = 1+Math.floor(Math.random() * 8);
				y = 1+Math.floor(Math.random() * 10);
				
				if(this.board[x-1][y-1]!=1&&this.board[x][y-1]!=1&&this.board[x+1][y-1]!=1&&this.board[x+2][y-1]!=1&&this.board[x+3][y-1]!=1&&this.board[x-1][y]!=1&&this.board[x][y]==0&&this.board[x+1][y]==0&&this.board[x+2][y]==0&&this.board[x+3][y]!=1&&this.board[x-1][y+1]!=1&&this.board[x][y+1]!=1&&this.board[x+1][y+1]!=1&&this.board[x+2][y+1]!=1&&this.board[x+3][y+1]!=1){
					this.board[x-1][y-1]=2;
					this.board[x-1][y]=2;
					this.board[x-1][y+1]=2;
					this.board[x][y]=1;
					this.board[x][y-1]=2;
					this.board[x][y+1]=2;
					this.board[x+1][y]=1;
					this.board[x+1][y-1]=2;
					this.board[x+1][y+1]=2;
					this.board[x+2][y]=1;
					this.board[x+2][y-1]=2;
					this.board[x+2][y+1]=2;
					this.board[x+3][y]=2;
					this.board[x+3][y-1]=2;
					this.board[x+3][y+1]=2;
					isEmpty=true;
					if(isEmpty){
						break;
					}				
				}
			}
		}
		isEmpty = false;
	}	

	drawBoatOfTwo(){
		let x = 0;
		let y = 0;
		let direction = 0;
		let isEmpty = false;
		while(!isEmpty){
			direction = Math.floor(Math.random() * 2);
			
			if(direction==0){
				x = 1+Math.floor(Math.random() * 10);
				y = 1+Math.floor(Math.random() * 9);
		
				if(this.board[x-1][y-1]!=1&&this.board[x-1][y]!=1&&this.board[x-1][y+1]!=1&&this.board[x-1][y+2]!=1&&this.board[x][y-1]!=1&&this.board[x][y]==0&&this.board[x][y+1]==0&&this.board[x][y+2]!=1&&this.board[x+1][y-1]!=1&&this.board[x+1][y]!=1&&this.board[x+1][y+1]!=1&&this.board[x+1][y+2]!=1){
					this.board[x-1][y-1]=2;
					this.board[x][y-1]=2;
					this.board[x+1][y-1]=2;
					this.board[x][y]=1;
					this.board[x-1][y]=2;
					this.board[x+1][y]=2;
					this.board[x][y+1]=1;
					this.board[x-1][y+1]=2;
					this.board[x+1][y+1]=2;
					this.board[x][y+2]=2;
					this.board[x-1][y+2]=2;
					this.board[x+1][y+2]=2;
					isEmpty=true;
					if(isEmpty){
						break;
					}
				}
			}
			
			if(direction==1){
				x = 1+Math.floor(Math.random() * 9);
				y = 1+Math.floor(Math.random() * 10);
				
				if(this.board[x-1][y-1]!=1&&this.board[x][y-1]!=1&&this.board[x+1][y-1]!=1&&this.board[x+2][y-1]!=1&&this.board[x-1][y]!=1&&this.board[x][y]==0&&this.board[x+1][y]==0&&this.board[x+2][y]!=1&&this.board[x-1][y+1]!=1&&this.board[x][y+1]!=1&&this.board[x+1][y+1]!=1&&this.board[x+2][y+1]!=1){
					this.board[x-1][y-1]=2;
					this.board[x-1][y]=2;
					this.board[x-1][y+1]=2;
					this.board[x][y]=1;
					this.board[x][y-1]=2;
					this.board[x][y+1]=2;
					this.board[x+1][y]=1;
					this.board[x+1][y-1]=2;
					this.board[x+1][y+1]=2;
					this.board[x+2][y]=2;
					this.board[x+2][y-1]=2;
					this.board[x+2][y+1]=2;
					isEmpty=true;
					if(isEmpty){
						break;
					}				
				}
			}
		}
		isEmpty = false;
	}
	
	drawBoatOfOne(){
		let x = 0;
		let y = 0;
		let isEmpty = false;
		
		while(!isEmpty){
			x = 1+Math.floor(Math.random() * 10);
			y = 1+Math.floor(Math.random() * 10);
			
			if(this.board[x-1][y-1]!=1&&this.board[x-1][y]!=1&&this.board[x-1][y+1]!=1&&this.board[x][y-1]!=1&&this.board[x][y]==0&&this.board[x][y+1]!=1&&this.board[x+1][y-1]!=1&&this.board[x+1][y]!=1&&this.board[x+1][y+1]!=1){
				this.board[x-1][y-1]=2;
				this.board[x][y-1]=2;
				this.board[x+1][y-1]=2;
				this.board[x][y]=1;
				this.board[x-1][y]=2;
				this.board[x+1][y]=2;
				this.board[x][y+1]=2;
				this.board[x-1][y+1]=2;
				this.board[x+1][y+1]=2;
				isEmpty=true;
				if(isEmpty){
					break;
				}
			}
		}
		isEmpty = false;
	}
	
}

let game = new Game();
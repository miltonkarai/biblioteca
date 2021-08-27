var trex,trexBateu,trexCorrendo;

var chao, imagemchao,chaoInvisivel;

var nuvem,imagemNuvem,grupoDeNuvens;

var obstaculo, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6,grupoDeObstaculos;

var pontuacao;

var estadoDoJogo = "jogar";

var fimDeJogo,fimDeJogoImg;

var reiniciar,reiniciarImg;

var pulo,morte, ponto;
var larguraJogo=window.innerWidth;


function criaNuvens(){
  if(frameCount%60===0){
    nuvem=createSprite(larguraJogo,100,40,10);
    nuvem.y=Math.round(random(10,100));
    nuvem.addImage("cloud",imagemNuvem);
    nuvem.velocityX=-3;
    nuvem.scale=0.6;
    nuvem.depth=trex.depth;
    
    trex.depth=trex.depth+1;
    
    grupoDeNuvens.add(nuvem);
  }
}

function criaObstaculos(){
  if(frameCount%60===0){
    obstaculo=createSprite(larguraJogo, 162, 10, 50);
    obstaculo.velocityX = -(6+pontuacao/200);
    
    numeroObstaculo = Math.round(random(1,6));
    
    switch(numeroObstaculo) {
      case 1: obstaculo.addImage(obstaculo1);
          break;
      case 2: obstaculo.addImage(obstaculo2);
          break;
      case 3: obstaculo.addImage(obstaculo3);
          break;
      case 4: obstaculo.addImage(obstaculo4);
          break;
      case 5: obstaculo.addImage(obstaculo5);
          break;
      case 6: obstaculo.addImage(obstaculo6);
          break;
    }
    
    obstaculo.scale=0.5;
    
    grupoDeObstaculos.add(obstaculo);
  }
}

function reset() {
  estadoDoJogo="jogar"
  
  grupoDeObstaculos.destroyEach()
  grupoDeNuvens.destroyEach()
  
  trex.changeAnimation("correndo",trexCorrendo)
  
  pontuacao=0
}

function preload(){
  trexCorrendo = loadAnimation("trex1.png", "trex3.png", "trex4.png")
  trexBateu=loadAnimation("trex_collided.png")
  
  imagemchao=loadAnimation("ground2.png","ground2.png","ground2.png"); 
  imagemNuvem=loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png")
  
  fimDeJogoImg=loadImage("gameOver.png");
  reiniciarImg=loadImage("restart.png")
  
  pulo=loadSound("jump.mp3")
  morte=loadSound("die.mp3")
  ponto=loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(larguraJogo,200)

  trex = createSprite(50, 155, 15, 50);
  trex.addAnimation('correndo', trexCorrendo);
  trex.addAnimation("bateu",trexBateu)
  trex.scale = 0.7;
  trex.setCollider("circle", 0, 0, 40);
  trex.debug = false;
  
  chao=createSprite( larguraJogo/2,180,larguraJogo,20)
  chao.addAnimation("ground",imagemchao)
  chao.x=chao.width / 2
  
  chaoInvisivel=createSprite(larguraJogo/2,195,larguraJogo,20)
  chaoInvisivel.visible=false
  
  grupoDeObstaculos = new Group();
  grupoDeNuvens = new Group();
  
  pontuacao = 0;
  
  reiniciar=createSprite(larguraJogo/2,140)
  reiniciar.addImage(reiniciarImg)
  reiniciar.scale=0.6
  
  fimDeJogo=createSprite(larguraJogo/2,100,300,400)
  fimDeJogo.addImage(fimDeJogoImg)
  fimDeJogo.scale=1.0 
}

function draw() {
  background('white');
  text('Pontuação: ' + pontuacao, larguraJogo-100,50);
  
  if (estadoDoJogo === "jogar") {
    pontuacao = pontuacao + Math.round(frameCount/60);
    fimDeJogo.visible=false
    reiniciar.visible=false
  
    chao.velocityX = -(6+pontuacao/200);   
    
    if(pontuacao>0&&pontuacao%10000===0){
      ponto.play()
    }
    
    if( chao.x<0){
      chao.x=chao.width/2
    }
    
    if ((touches.length >0|| keyDown('space') ) && trex.y>=100) {
      trex.velocityY = -13;
      pulo.play()
      touches=[]
    }
    
    criaNuvens();
  
    criaObstaculos();
    
    if(grupoDeObstaculos.isTouching(trex)){
      estadoDoJogo="encerrar";
      morte.play()
    }  
    
  } else if (estadoDoJogo === "encerrar"){
    fimDeJogo.visible=true
    reiniciar.visible=true
    chao.velocityX = 0; 
    grupoDeObstaculos.setLifetimeEach(-1);
    grupoDeNuvens.setLifetimeEach(-1);
    grupoDeObstaculos.setVelocityXEach(0)
    grupoDeNuvens.setVelocityXEach(0)
    trex.changeAnimation("bateu",trexBateu)

    if (touches.length >0||mousePressedOver(reiniciar)) {
      reset();
      touches=[]
    }
  }
  
  trex.velocityY = trex.velocityY + 1;
  trex.collide(chaoInvisivel);
  
  

  drawSprites();
}
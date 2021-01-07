
class _Menu {
    
    constructor () {
        
        
        this.container = new PIXI.Container(); 
        this.container.interactiveChildren = true;

        app.stage.addChild(this.container);

        this.P1Button_text_style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 35,
            fill: '#555555',
            strokeThickness: 10,
        });
        this.Title_text_style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 75,
            fill: '#555555',
            strokeThickness: 15,
        });





        // Title text
        this.Title = new PIXI.Text("TETRIS", this.Title_text_style);
        
        this.Title.x = 400;
        this.Title.y = 100;

        this.container.addChild(this.Title);

        



        // Begin Game -- button, currently endless mode
        
        this.Endless = new PIXI.Container();
        this.Endless.x = 400;
        this.Endless.y = 300;

        const Endless_rect = new PIXI.Graphics();
        Endless_rect.beginFill(0xffffff);    
        Endless_rect.lineStyle(10, 0xffffff);     
        Endless_rect.drawRect(0,0,400,70);
        Endless_rect.zIndex = 1;

        const Endless_text = new PIXI.Text("ENDLESS", this.P1Button_text_style);
        Endless_text.zIndex = 2;

        this.Endless.addChild(Endless_text);
        this.Endless.addChild(Endless_rect);

        this.Endless.interactive = true;
        this.Endless.buttonMode = true;
        this.Endless.on('pointerdown', () => {

            Game.init("Endless");
            Menu.container.destroy();
        });
        this.container.addChild(this.Endless);
    

        // 40L -- button, currently endless mode
    
        this._40L = new PIXI.Container();
        this._40L.x = 400;
        this._40L.y = 400;

        const _40L_rect = new PIXI.Graphics();
        _40L_rect.beginFill(0xffffff);    
        _40L_rect.lineStyle(10, 0xffffff);     
        _40L_rect.drawRect(0,0,400,70);
        _40L_rect.zIndex = 1;

        const _40L_text = new PIXI.Text("SPRINT", this.P1Button_text_style);
        _40L_text.zIndex = 2;

        this._40L.addChild(_40L_text);
        this._40L.addChild(_40L_rect);

        this._40L.interactive = true;
        this._40L.buttonMode = true;
        this._40L.on('pointerdown', () => {

            Game.init("40L");
            Menu.container.destroy();
        });
        this.container.addChild(this._40L);
    }
}

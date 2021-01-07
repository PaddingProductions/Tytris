class _Results  {

    constructor (stats) {
        
        this.container = new PIXI.Container(); 
        this.container.interactiveChildren = true;

        app.stage.addChild(this.container);

        this.button_text_style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 35,
            fill: '#555555',
            strokeThickness: 1,
        });
        this.statistics_text_style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fill: '#555555',
            strokeThickness: 1,
        });
        



        // Begin Game -- button, currently endless mode
        
        this.Menu = new PIXI.Container();
        this.Menu.x = 400;
        this.Menu.y = 100;

        const Menu_rect = new PIXI.Graphics();
        Menu_rect.beginFill(0xffffff);    
        Menu_rect.lineStyle(10, 0xffffff);     
        Menu_rect.drawRect(0,0,800,70);
        Menu_rect.zIndex = 1;

        const Menu_text = new PIXI.Text("MENU", this.button_text_style);
        Menu_text.zIndex = 2;

        this.Menu.addChild(Menu_text);
        this.Menu.addChild(Menu_rect);

        this.Menu.interactive = true;
        this.Menu.buttonMode = true;
        this.Menu.on('pointerdown', () => {

            Menu = new _Menu();
            this.container.destroy();
            Results = undefined;
        });
        this.container.addChild(this.Menu);







        // Begin Game -- button, currently endless mode

        this.Retry = new PIXI.Container();
        this.Retry.x = 400;
        this.Retry.y = 175;

        const Retry_rect = new PIXI.Graphics();
        Retry_rect.beginFill(0xffffff);    
        Retry_rect.lineStyle(10, 0xffffff);     
        Retry_rect.drawRect(0,0,400,70);
        Retry_rect.zIndex = 1;

        const Retry_text = new PIXI.Text("RETRY", this.button_text_style);
        Retry_text.zIndex = 2;

        this.Retry.addChild(Retry_text);
        this.Retry.addChild(Retry_rect);

        this.Retry.interactive = true;
        this.Retry.buttonMode = true;
        this.Retry.on('pointerdown', () => {

            Game.init();
            this.container.destroy();
            Results = undefined;
        });
        this.container.addChild(this.Retry);






        this.stats = new PIXI.Container();
        this.stats.x = 100;
        this.stats.y = 400;

        const minutes = Math.floor(stats.time/60000);
        const seconds = Math.floor((stats.time/1000) % 60);
        const milliseconds = Math.floor(stats.time % 1000);

        stats.time = "" + minutes + ":" + seconds + "." + milliseconds;
        stats = Object.entries(stats);

        for (let i=0; i<stats.length; i++) {

            const text =  new PIXI.Text(
                stats[i][0] + "   " + stats[i][1], 
                this.statistics_text_style
            )
            text.y += i*100;

            this.stats.addChild(text);
            
        }
        this.container.addChild(this.stats);
    }
}
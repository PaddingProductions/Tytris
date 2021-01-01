Update_Display = function () {

    for (let i=0; i<stack.length; i++) 
        stack[i].Update_Display();

    if (Current_piece != undefined) 
        Current_piece.Update_Display();

    if (Shadow_piece != undefined) 
        Shadow_piece.Update_Display();

    Preview.Update_Display();
    
    return;
}
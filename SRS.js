const RotatingSystem = {

    rotate: (piece, newRotation) => {

        var offset1 = Kick_Table[piece.shape][piece.rotation];  //offsets of original rotation
        var offset2 = Kick_Table[piece.shape][newRotation];     //offsets of new rotation

        var kick_tests = []; // kicktable
        
        for (let i=0; i<offset1.length; i++) { // calculates kick table

            kick_tests.push({
                x: offset1[i].x - offset2[i].x,
                y: offset1[i].y - offset2[i].y,
            });
        }


        for (let i=0; i<kick_tests.length; i++) {  // for all tests
            
            var startX = piece.x - (piece.map[0].length - 1)/2; // holds x and y used for rotation result
            var startY = piece.y -    (piece.map.length - 1)/2; // origin same as by occupation chart
            
            var test_map =  MasterList[piece.shape][newRotation]; // the new map to check
            
            // checks if this solution does not overlap
            var is_valid = RotatingSystem.check_kick_solution(startX, startY, kick_tests[i], test_map); 

            if (is_valid) { // it it does work
 
                piece.rotation = newRotation  // change variables
                piece.map = MasterList[piece.shape][piece.rotation];
                piece.x += kick_tests[i].x;
                piece.y -= kick_tests[i].y; // because the kick table is generated under the assumption y axis grows up, unlike js
                piece.lock_delay = 0; // lock delay reset
                piece.lock_reset_counter ++;
                return;
            }
            
        }

    },

    check_kick_solution: function (startX, startY, kick_test, map) { // checks for overlaps after applying rotation

        startX += kick_test.x;
        startY -= kick_test.y;

        for  (let y=0; y<map.length; y++) { 
            for (let x=0; x<map[y].length; x++) {  // for all nodes


                var currX = startX + x; 
                var currY = startY + y;  // this is because kicktable's y axis goes up not down like in canvas
                
                if (map[y][x] == 0) continue; // no need to process empty nodes


                if (currX < 0 || currY < 0 || currX >= 10 || currY >= 20) return false; // if past boardars
                if (OccupationChart[currY][currX] == 1) return false; // if overlapping stack
                


            }
        }
        return true;
    },
}
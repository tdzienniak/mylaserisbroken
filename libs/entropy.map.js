{"version":3,"file":"build/Entropy.min.js","sources":["build/Entropy.js"],"names":["global","isString","val","String","app","VERSION","Entropy","getVersion","Engine","game","_can_modify","this","_greatest_e_id","_e_ids_to_reuse","_entities","_current_e_id","_components","_component_pool","_component_pool_size","_nodes","_systems","OrderedLinkedList","_updating","_entities_mapping","_families","none","_e_family_index","i","_next_c_id","_component_manifest","_system_manifest","component","name","Game","error","system","node","prototype","canModify","createEntity","family","families","split","length","id","pop","max","f","push","removeEntity","component_id","_name","_e_famlily_mapping","f_id","indexOf","splice","add","args","Array","slice","call","arguments","c_name","c_id","new_c","toLowerCase","init","apply","remove","getComponents","c_array","c_matched","len","e_id","temp","len2","getEntitiesWith","e_matched","found","getAllEntities","map","entity","getFamily","log","addSystem","priority","insert","removeSystem","isUpdating","isSystemActive","head","data","next","update","delta","getComponentPoolSize","starting_state","input","engine","ticker","addListener","changeState","_consts","_states","dummy","onEnter","onReturn","onExit","_current_state","_entered_states","_e_patterns","addState","state_obj","entityPattern","obj","pattern","message","console","Error","join","constans","value","toUpperCase","hasOwnProperty","Object","defineProperty","unshift","setRenderer","renderer","setStage","stage","create","start","pause","resume","Input","_pressed_keys","window","addEventListener","e","keyCode","_keys","BACKSPACE","TAB","ENTER","SHIFT","CTRL","ALT","PAUSE_BREAK","CAPS_LOCK ","ESCAPE","SPACE","PAGE_UP","PAGE_DOWN","END","HOME","LEFT_ARROW","UP_ARROW","RIGHT_ARROW","DOWN_ARROW","INSERT","DELETE","0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","LEFT_WINDOW_KEY","RIGHT_WINDOW_KEY","SELECT_KEY","NUMPAD_0","NUMPAD_1","NUMPAD_2","NUMPAD_3","NUMPAD_4","NUMPAD_5","NUMPAD_6","NUMPAD_7","NUMPAD_8","NUMPAD_9","MULTIPLY","ADD","SUBTRACT","DECIMAL_POINT","DIVIDE","F1","F2","F3","F4","F5","F6","F7","F8","F9","F11","F12","NUM_LOCK","SCROLL_LOCK","SEMI_COLON","EQUAL_SIGN","COMMA","DASH","PERIOD","FORWARD_SLASH","GRAVE_ACCENT","OPEN_BRACKET","BACK_SLASH","CLOSE_BRACKET","SINGLE_QUOTE","isPressed","getPressedKeys","keys","tail","Node","append","current","iterate","fn","lastTime","vendors","x","requestAnimationFrame","cancelAnimationFrame","callback","currTime","Date","getTime","timeToCall","Math","setTimeout","clearTimeout","performance","now","nowOffset","timing","navigationStart","Ticker","tick","raf","_paused","is_running","time","last_time_value","MAX_FRAME_TIME","FPS","event","ticks","_ticks","paused","callbacks","_raf_id","setFPS","fps","getFPS","getTicks","that","Vector","coords","toString","y","updatePolarCoords","angle","updateCartCoords","v","rotate","newAngle","fullAngles","abs","floor","vector","returnNew","scale","scalar","setAngle","truncate","desiredLength","normalize","substract","dot","reverseX","reverseY","reverseBoth","angleBetween","negate","clone","sqrt","pow","atan2","PI","cos","sin","debug"],"mappings":"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"}
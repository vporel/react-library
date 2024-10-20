
import { dashToCamelCase } from '@vporel/js/strings';
import React from 'react';
import { createRoot } from 'react-dom/client';

/**
 * The HTMLElement can define the attribute data-load-if to load the component with condition(s)
 * The prop-types are checked using the code in '@vporel/js/prop-types'
 * @param {*} Component 
 * @param {*} HTMLElement 
 * @returns 
 */
export function loadComponent(Component, HTMLElement, props = {}){
    if(props.loadIf != undefined){ // There's a condition that tells whether the component should be loaded or not
        let test = new Function("return " + props.loadIf)
        if(!test.call(HTMLElement)) return;
    }
        
    if(Component.propTypes != undefined){
        let errors = check(Component.propTypes, props)
        if(errors.length > 0){
            console.error("Erros with : ", Component.name, errors)
            return;
        }
    }
    // Render your React component instead
    const root = createRoot(HTMLElement);
    root.render(<Component {...props}/>);
}

export function reactCustomElement(tagName, Component){
    customElements.define(tagName, class extends HTMLElement{
        connectedCallback(){
            let props = {}
            for(const attr of this.attributes) props[dashToCamelCase(attr.name)] = attr.value //Convert the attributes names to camelCase and get the values
            loadComponent(Component, this, props)
        }
    })
}
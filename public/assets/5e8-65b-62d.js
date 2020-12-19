// Immutable for comparison of empty properties
const EMPTY_PROPS = {};
// Immutable for empty children comparison
const EMPTY_CHILDREN = [];
// Internal marker to know if the vdom comes from Atomico
const vdom = Symbol();
/**
 * @param {string|null|RawNode} type
 * @param {object} [p]
 * @param  {...any} children
 * @returns {Vdom}
 */
function h(type, p, ...children) {
    let props = p || EMPTY_PROPS;

    children = flat(props.children || children, type == "style");

    if (!children.length) {
        children = EMPTY_CHILDREN;
    }

    return {
        vdom,
        type,
        props,
        children,
        key: props.key,
        shadow: props.shadowDom,
        //@ts-ignore
        raw: type instanceof Node,
    };
}
/**
 * @param {Array<any>} children
 * @param {boolean} [saniate] - If true, children only accept text strings
 * @param {FlatParamMap} map
 * @returns {FlatParamMap}
 */
function flat(children, saniate, map = []) {
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        if (child) {
            if (Array.isArray(child)) {
                flat(child, saniate, map);
                continue;
            }
            if (child.key != null) {
                if (!map._) map._ = new Map();

                map._.set(child.key, 0);
            }
        }
        let type = typeof child;
        child =
            child == null ||
            type == "boolean" ||
            type == "function" ||
            (type == "object" && (child.vdom != vdom || saniate))
                ? ""
                : child;
        if (saniate) {
            map[0] = (map[0] || "") + child;
        } else {
            map.push(child);
        }
    }
    return map;
}

/**
 * @typedef {object} Vdom
 * @property {any} type
 * @property {symbol} vdom
 * @property {Object<string,any>} props
 * @property {FlatParamMap} [children]
 * @property {any} [key]
 * @property {boolean} [raw]
 * @property {boolean} [shadow]
 */

/**
 *
 * @typedef {Object} HandleEvent
 * @property {(event:Event|CustomEvent)=>any} handleEvent
 */

/**
 *
 * @typedef {(event:Event|CustomEvent)=>any} Listener
 */

/**
 * @typedef {Object<string,Listener> & HandleEvent } Handlers
 */

/**
 * @typedef {Object<string,any>} StyleFill
 */

/**
 * @typedef {Object} Style
 * @property {string} cssText
 */

/**
 * @typedef { any } RawNode
 */

/**
 * @typedef {symbol|string} ID
 */

/**
 * @typedef {Array<any> & {_?:Map<any,any>}} FlatParamMap
 */

/**
 * @typedef {ChildNode[] & {splice?:any}} Nodes
 */

console.log(h);

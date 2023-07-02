import Vue from 'vue'
import type { VNode } from 'module'

declare global {
  namespace JSX {
    type Element = VNode
    type ElementClass = Vue
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}

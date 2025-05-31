# Mechanical linkage drawing simulator

This is a web app for generating drawings via mechanical linkage systems, like the "Spirograph" children's toy, or fancy scrollwork on currency ("intaglio").

A mechanical linkage is basically a collection of rotating wheels and rods that are attached to each other in some way. In this app, the user can create wheels and rods, connect them together, and play an animation that simulates the wheels turning and the linkage arms moving around. It is basically a 2D, lightweight, heavily constrained physics simulator.

Key elements:

- Main canvas, displays wheels & rods
- Toolbar with tools:
    - "Wheel" tool: add a new wheel where the user clicks.
        - wheels need a picture / texture / gradient, so you can tell when they're rotating. Pick whatever's simplest to implement.
    - "Rod" tool: user drags to define a new rod. Basically a line with a little thickness.
    - "Pivot" tool: user clicks on overlapping elements to connect them so that they remain fixed at the pivot. (But they can still rotate around the pivot.)
- User can drag elements around on the canvas.
    - Drag the end of a rod to make it longer
    - Drag the middle of a rod to reposition it
    - Drag a wheel's center to reposition it
    - Drag a wheel's edge to change its radius
- Time controls:
    - "Timeline" indicator: a horizontal line shows time, with t=0 in the middle, and there's a little playhead icon to show the current time.
        - Can drag the playhead, similar to "scrubbing" in a video editor. Causes the simulation to play forward / backward to the playhead's indicated time.
    - "Play / pause": runs the simulation, rotating each wheel at a rate of 1 revolution per second.

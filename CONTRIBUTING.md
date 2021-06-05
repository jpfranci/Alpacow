# Starting Guide
Run `yarn setup` when you first clone this project.

Run `yarn bootstrap` to install any new dependencies on packages (client and server) 

Run `yarn dev` to run hot reload mode on all packages (client and server)

# Client Development
To run storybook, run `yarn storybook`, this provides an isolated environment where you can develop a component in isolation 
and experiment with different props. To create a story for a component, create a file called `<component_name>.stories.tsx|jsx`. 
Look at `example-button.stories.tsx` for an example.


# Commits
Currently, we are running `prettier` on every commit to make sure everything is styled nicely.
This runs automatically and commits only staged files.

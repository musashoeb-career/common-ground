# Common Ground

i want to make a simple yet elegant looking prototype for the react web frontend of a ridesharing app whose basis for routes is crowdsourced data. main features of the app will be users who input routes, with their starting point and destination specified. they will also be able to select a category for their routes for example, medical, leisure, work, etc

the app will then plot their route google maps style onto the supermap for everyone to see

people who have a car will then be able to look at a simple map of all the routes users have entered, and based on the intensity of the convergence points (say a shared road for example) they can choose to start operating a route which they feel covers the most amount of people. all they have to enter is a pickup point and a dropoff point, and it will show up in the available rides tab for the users. for simplicitys sake lets not graph the rides offered, only the routes people wish to travel

i know that graphing a google maps style map is super ambitious and probably requires API integration. so given that reason, just for proof of concept, make the "super map" a simple coordinate grid which can be interacted with by the users. when users enter their "starting and ending point", its really just them entering exact coordinate points in the grid, and then the UI graphs a straight line segment between the two points. if any other line from another "route" overlaps part of all of any given line segment, make sure to indicate that in some way, for example by making that line segment thicker. 

for example, if one user entered coords (0,0) and (3,0), and therefore their "route" is 3 units long in the horizontal direction, and another user entered (5,0) instead, the portion from 0,0 to 3,0 would be visibly thicker than from 3,0 to 5,0, and get progressively thicker for each additional overlap. 

main screens of app should be "super map", "input coords (route creation)" screen , "ride creation" screen (for drivers) - remember, their coords arent graphed on the super map, just stored in the same way (coords for pickup point, coords for dropoff point). graph them on their own map though in the detail view of the ride so riders can see where the driver plans to go

make sure the UI is elegant and modern looking, with big buttons and soft UI as this is meant to be accessible for a lot of people. build it in phases, so i can have input along the way.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/12d905c2-b613-4171-9055-7b97e15fdceb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/admin/setup',
            name: 'setup',
            meta: {authRequired: true},
            component: () => import('../routes/admin/Setup.vue')
        },
        {
            path: '/admin/stats',
            name: 'stats',
            meta: {authRequired: true},
            component: () => import('../routes/admin/Stats.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../routes/Login.vue')
        },
        {
            path: '/logout',
            name: 'logout',
            component: () => import('../routes/LogoutView.vue')
        },
        {
            path: '/game',
            name: 'game',
            component: () => import('../routes/Game.vue')
        },
        {
            path: '/rules',
            name: 'rules',
            component: () => import('../routes/Rules.vue')
        },
        {
            path: '/join',
            name: 'join',
            component: () => import('../routes/JoinGame.vue')
        },
        {
            path: '/start/',
            name: 'start',
            meta: {authRequired: true, overwrite: false},
            component: () => import('../routes/admin/StartGame.vue')
        },
        {
            path: '/admin/assign',
            name: 'reassign',
            meta: {authRequired: true, overwrite: true},
            component: () => import('../routes/admin/StartGame.vue')
        },
        {
            path: '/admin/teams',
            name: 'teams',
            meta: {authRequired: true},
            component: () => import('../routes/admin/Teams.vue')
        },
        {
            path: '/admin',
            name: 'admin',
            meta: {authRequired: true},
            component: () => import('../routes/admin/Overview.vue')
        },
        {
            path: '/admin/spots',
            name: 'spots',
            meta: {authRequired: true},
            component: () => import('../routes/admin/Spots.vue')
        },
        {
            path: '/spot/:id',
            name: 'spot',
            meta: {guest: true},
            component: () => import('../routes/Spot.vue')
        },
        {
            path: '/quest/:id',
            name: 'quest',
            component: () => import('../routes/Quest.vue')
        },
        {
            path: '/team/:id?',
            name: 'team',
            component: () => import('../routes/Team.vue')
        },
        {
            path: '/map',
            name: 'map',
            component: () => import('../routes/Map.vue')
        },
        {path: '/', name: 'home', component: () => import('../routes/Home.vue')},
    ]
})
router.replace({path: '*', redirect: '/'})

export default router

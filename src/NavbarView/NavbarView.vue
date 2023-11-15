<!-- Vue components don't have to be complicated. They can just be a bit of powered-up HTML. -->

<template>
  <!-- Vue has special handling for `style`, allowing you to feed it objects -->
  <div class="mx-3" :style="{ color: 'white' }">HelloWorld in the Navbar</div>

  <!-- ***The below component is for enabling a full-page applet*** -->

  <!-- Navigation within the Vue application is best handled using RouterLink https://router.vuejs.org/guide/#router-link 
  The `to` prop directs the router navigation
    For the full page applet the required starting `name` path is 'pageApplet'
    With the `params` section we provide the `slug` string which needs to match the `xuiConfig`
    Ex. "met_targets": {"ssp": {"fullPage": [{"slug": "my-url"}]}}
  The style and class here provide css to approximate the appearance of the existing navigation
  -->
  <RouterLink
    :to="{ name: 'pageApplet', params: { slug: 'my-url' } }"
    :style="{ color: 'white' }"
    class="d-inline-flex align-center text-decoration-none font-weight-regular text-body-1 px-4 h-100"
    >My Applet</RouterLink
  >
</template>

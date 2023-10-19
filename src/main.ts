import bootstrap from './bootstrap';

const { createNestServer } = bootstrap();
createNestServer()
  .then((server) => {
    server.boot();
  });

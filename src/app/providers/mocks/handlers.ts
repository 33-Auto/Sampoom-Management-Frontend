const modules = import.meta.glob(
  "../../../{entities,features,pages}/**/mocks/handlers.ts",
  { eager: true },
);

export const handlers = Object.values(modules)
  .map((module: any) => module.handlers)
  .flat();

console.log(`[MSW] ${handlers.length} handlers loaded successfully.`);

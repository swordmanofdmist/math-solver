import { useRouter } from "next/router";

export const supportedLocales = ["en", "mk"] as const;

export type Locale = (typeof supportedLocales)[number];

export const translations = {
  en: {
    common: {
      appName: "Math Solver",
      language: "Language",
      mainNavigation: "Main navigation",
      switchSolver: "Switch solver",
      generateExample: "Generate example",
      recentEquations: "Recent equations",
      noEquations: "No equations yet.",
      result: "Result",
      solutionComplete: "Solution complete",
      copyResult: "Copy result",
      copied: "Copied!",
      function: "Function",
      variable: "Variable",
      example: "Example",
      derivatives: "Derivatives",
      integrals: "Integrals",
      series: "Series",
      footer:
        "Math Solver helps practice derivatives, integrals, and series. Built by Konstantin and Codex.",
    },
    home: {
      metaDescription:
        "A Next.js math solver for derivatives, integrals, and series.",
      intro:
        "Enter calculus and series problems, choose the right solver, and get a structured result from the app.",
      coverAria: "Calculus terms cover",
      coverAlt: "Illustrated calculus terms reference chart",
      operations: "Operations",
      definitionsHeading: "What each solver means",
      openSolver: (title: string) => `Open ${title} solver`,
      source: "Source",
      manualTitle: "User manual",
      manualSteps: [
        "Choose a solver from the navigation bar.",
        "Enter the math expression using variables like x or n.",
        "Fill in extra options such as derivative order or integral bounds.",
        "Submit the form to solve the problem and view the result.",
      ],
      operationsList: [
        {
          title: "Derivative",
          label: "Differentiation",
          description:
            "A derivative describes how quickly a function changes at a specific point, which makes it useful for slopes, velocity, optimization, and sensitivity. In this app, the derivative solver is meant for expressions where you want to see how one variable responds as another variable moves. Britannica explains differential calculus as the part of calculus concerned with instantaneous rates of change and the slope of a curve at a point. Use this operation when the question is about change, steepness, tangent lines, or finding where a function increases and decreases.",
        },
        {
          title: "Integral",
          label: "Integration",
          description:
            "An integral represents accumulation across an interval, so it is the operation to reach for when small pieces need to be added into a total. The integral solver supports the kind of thinking used for area under a curve, displacement from velocity, total growth, and other continuous quantities. Britannica describes integral calculus as summing infinitely many small parts to determine a whole, such as the area under a curve. Use this operation when the problem asks for a total amount, an antiderivative, or the effect of a function over a range.",
        },
        {
          title: "Series",
          label: "Convergence",
          description:
            "A mathematical series adds the terms of a sequence, often to understand whether infinitely many values still settle toward a finite answer. The series solver is designed for expressions with an index such as n, where the main question is whether the running sum stabilizes or grows without bound. For infinite series, Britannica describes convergence as the partial sums approaching a definite finite limit. Use this operation when the problem is about convergence, divergence, partial sums, or recognizing patterns in repeated addition.",
        },
      ],
    },
    derivative: {
      pageTitle: "Derivative Solver | Math Solver",
      heading: "Derivative Solver",
      intro:
        "Enter a function and choose which derivative order should be solved.",
      order: "Derivative order",
      solving: "Solving...",
      solve: "Solve derivative",
      errors: {
        expression: "Enter a function before solving.",
        variable: "Enter the variable to differentiate by.",
        order: "Derivative order must be a whole number greater than 0.",
        solve: "Could not solve the derivative.",
      },
      resultText: (
        order: number,
        variable: string,
        expression: string,
        result: string,
      ) =>
        order === 1
          ? `d/d${variable} (${expression}) = ${result}`
          : `d^${order}/d${variable}^${order} (${expression}) = ${result}`,
    },
    integral: {
      pageTitle: "Integral Solver | Math Solver",
      heading: "Integral Solver",
      intro:
        "Enter a function and choose whether the problem is an indefinite or definite integral.",
      type: "Integral type",
      indefinite: "Indefinite",
      definite: "Definite",
      lowerBound: "Lower bound",
      upperBound: "Upper bound",
      solving: "Solving...",
      solve: "Solve integral",
      errors: {
        expression: "Enter a function before solving.",
        variable: "Enter the variable to integrate by.",
        bounds: "Enter both bounds for a definite integral.",
        solve: "Could not solve the integral.",
      },
      recentText: (
        type: string,
        expression: string,
        variable: string,
        lowerBound: string,
        upperBound: string,
      ) =>
        `${type} integral of ${expression} d${variable}${
          lowerBound && upperBound ? ` from ${lowerBound} to ${upperBound}` : ""
        }`,
      resultText: (
        type: string,
        expression: string,
        variable: string,
        lowerBound: string,
        upperBound: string,
        result: string,
      ) =>
        `${type} integral of ${expression} with respect to ${variable}${
          lowerBound && upperBound ? ` from ${lowerBound} to ${upperBound}` : ""
        } = ${result}`,
    },
    seriesPage: {
      pageTitle: "Series Solver | Math Solver",
      heading: "Series Solver",
      intro:
        "Enter the general term of a series and choose how convergence should be checked.",
      term: "Series term",
      indexVariable: "Index variable",
      startValue: "Start value",
      analyzing: "Analyzing...",
      analyze: "Analyze series",
      errors: {
        expression: "Enter a series term before analyzing.",
        variable: "Enter the index variable.",
        startValue: "Enter the starting index value.",
        analyze: "Could not analyze the series.",
      },
      recentText: (expression: string, variable: string, startValue: string) =>
        `sum of ${expression} from ${variable} = ${startValue} to infinity`,
      resultText: (
        expression: string,
        variable: string,
        startValue: string,
        result: string,
      ) =>
        `Sum of ${expression} from ${variable} = ${startValue} to infinity: ${result}`,
    },
  },
  mk: {
    common: {
      appName: "РешкО",
      language: "Јазик",
      mainNavigation: "Главна навигација",
      switchSolver: "Промени решавач",
      generateExample: "Генерирај пример",
      recentEquations: "Неодамнешни равенки",
      noEquations: "Сè уште нема равенки.",
      result: "Резултат",
      solutionComplete: "Решението е готово",
      copyResult: "Копирај резултат",
      copied: "Копирано!",
      function: "Функција",
      variable: "Променлива",
      example: "Пример",
      derivatives: "Изводи",
      integrals: "Интеграли",
      series: "Редови",
      footer:
        "Решавачот помага при вежбање изводи, интеграли и редови. Изработено од Константин и Codex.",
    },
    home: {
      metaDescription:
        "Решавач на математички задачи со Next.js за изводи, интеграли и редови.",
      intro:
        "Внесете задача од математичка анализа или редови, изберете го соодветниот решавач и добијте структуриран резултат.",
      coverAria: "Преглед на поими од математичка анализа",
      coverAlt: "Илустриран преглед на поими од математичка анализа",
      operations: "Операции",
      definitionsHeading: "Што значи секој решавач",
      openSolver: (title: string) => `Отвори го решавачот за ${title}`,
      source: "Извор",
      manualTitle: "Упатство за употреба",
      manualSteps: [
        "Изберете решавач од навигациската лента.",
        "Внесете математички израз со променливи како x или n.",
        "Пополнете ги дополнителните опции, како редот на изводот или границите на интегралот.",
        "Испратете ја формата за да ја решите задачата и да го видите резултатот.",
      ],
      operationsList: [
        {
          title: "Извод",
          label: "Диференцирање",
          description:
            "Изводот опишува колку брзо се менува една функција во определена точка, па затоа е корисен за наклони, брзина, оптимизација и чувствителност. Во оваа апликација, решавачот за изводи е наменет за изрази кај кои сакате да видите како една променлива реагира кога се менува друга. Britannica го објаснува диференцијалното сметање како дел од математичката анализа што се занимава со моменталните стапки на промена и наклонот на крива во дадена точка. Користете ја оваа операција кога задачата се однесува на промена, стрмнина, тангенти или одредување каде функцијата расте и опаѓа.",
        },
        {
          title: "Интеграл",
          label: "Интегрирање",
          description:
            "Интегралот претставува акумулација во даден интервал, па се користи кога треба да се соберат мали делови во една целина. Решавачот за интеграли го поддржува начинот на размислување што се користи за плоштина под крива, поместување од брзина, вкупен раст и други непрекинати величини. Britannica го опишува интегралното сметање како собирање бесконечно многу мали делови за да се определи целината, на пример плоштината под крива. Користете ја оваа операција кога задачата бара вкупна вредност, примитивна функција или ефект на функцијата во даден интервал.",
        },
        {
          title: "Редови",
          label: "Конвергенција",
          description:
            "Математичкиот ред ги собира членовите на една низа, често за да се утврди дали бесконечно многу вредности сепак се приближуваат до конечен резултат. Решавачот за редови е наменет за изрази со индекс како n, каде што главното прашање е дали парцијалната сума се стабилизира или расте без ограничување. Кај бесконечните редови, Britannica ја опишува конвергенцијата како приближување на парцијалните суми кон определена конечна граница. Користете ја оваа операција кога задачата се однесува на конвергенција, дивергенција, парцијални суми или препознавање обрасци во повторено собирање.",
        },
      ],
    },
    derivative: {
      pageTitle: "Решавач за изводи | Решавач на математички задачи",
      heading: "Решавач за изводи",
      intro: "Внесете функција и изберете го редот на изводот што треба да се пресмета.",
      order: "Ред на изводот",
      solving: "Се решава...",
      solve: "Пресметај извод",
      errors: {
        expression: "Внесете функција пред да започнете со решавање.",
        variable: "Внесете ја променливата според која се изведува.",
        order: "Редот на изводот мора да биде цел број поголем од 0.",
        solve: "Изводот не можеше да се пресмета.",
      },
      resultText: (
        order: number,
        variable: string,
        expression: string,
        result: string,
      ) =>
        order === 1
          ? `d/d${variable} (${expression}) = ${result}`
          : `d^${order}/d${variable}^${order} (${expression}) = ${result}`,
    },
    integral: {
      pageTitle: "Решавач за интеграли | Решавач на математички задачи",
      heading: "Решавач за интеграли",
      intro:
        "Внесете функција и изберете дали задачата е неопределен или определен интеграл.",
      type: "Вид на интеграл",
      indefinite: "Неопределен",
      definite: "Определен",
      lowerBound: "Долна граница",
      upperBound: "Горна граница",
      solving: "Се решава...",
      solve: "Пресметај интеграл",
      errors: {
        expression: "Внесете функција пред да започнете со решавање.",
        variable: "Внесете ја променливата според која се интегрира.",
        bounds: "Внесете ги двете граници за определен интеграл.",
        solve: "Интегралот не можеше да се пресмета.",
      },
      recentText: (
        type: string,
        expression: string,
        variable: string,
        lowerBound: string,
        upperBound: string,
      ) =>
        `${type} интеграл од ${expression} d${variable}${
          lowerBound && upperBound ? ` од ${lowerBound} до ${upperBound}` : ""
        }`,
      resultText: (
        type: string,
        expression: string,
        variable: string,
        lowerBound: string,
        upperBound: string,
        result: string,
      ) =>
        `${type} интеграл од ${expression} во однос на ${variable}${
          lowerBound && upperBound ? ` од ${lowerBound} до ${upperBound}` : ""
        } = ${result}`,
    },
    seriesPage: {
      pageTitle: "Решавач за редови | Решавач на математички задачи",
      heading: "Решавач за редови",
      intro:
        "Внесете го општиот член на редот и изберете како да се провери конвергенцијата.",
      term: "Член на редот",
      indexVariable: "Индексна променлива",
      startValue: "Почетна вредност",
      analyzing: "Се анализира...",
      analyze: "Анализирај ред",
      errors: {
        expression: "Внесете член на редот пред анализирање.",
        variable: "Внесете ја индексната променлива.",
        startValue: "Внесете ја почетната вредност на индексот.",
        analyze: "Редот не можеше да се анализира.",
      },
      recentText: (expression: string, variable: string, startValue: string) =>
        `сума од ${expression}, од ${variable} = ${startValue} до бесконечност`,
      resultText: (
        expression: string,
        variable: string,
        startValue: string,
        result: string,
      ) =>
        `Сума од ${expression}, од ${variable} = ${startValue} до бесконечност: ${result}`,
    },
  },
};

export function getLocale(locale?: string): Locale {
  return locale === "mk" ? "mk" : "en";
}

export function useI18n() {
  const router = useRouter();
  const locale = getLocale(router.locale);

  return { locale, t: translations[locale] };
}

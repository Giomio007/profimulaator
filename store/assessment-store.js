import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAssessmentStore = create(
  persist(
    (set) => ({
      // Состояния
      vacancyDetails: "",
      quizTitle: "",
      quizQuestions: [],
      userAnswers: [],
      results: null,

      // Действия
      setVacancyDetails: (details) => set({ vacancyDetails: details }),
      setQuizTitle: (title) => set({ quizTitle: title }),
      setQuizQuestions: (questions) => set({ quizQuestions: questions }),
      addUserAnswer: (answer) =>
        set((state) => ({
          userAnswers: [...state.userAnswers, answer],
        })),
      setUserAnswers: (answers) => set({ userAnswers: answers }),
      setResults: (results) => set({ results }),
      clearStore: () =>
        set({
          vacancyDetails: "",
          quizTitle: "",
          quizQuestions: [],
          userAnswers: [],
          results: null,
        }),
    }),
    {
      name: "assessment-storage",
      getStorage: () => localStorage,
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !["results"].includes(key))
        ),
    }
  )
);

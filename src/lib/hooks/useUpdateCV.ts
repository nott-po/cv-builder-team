"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { gqlClient } from "@/lib/graphql/fetcher";
import { UPDATE_CV_MUTATION } from "@/lib/graphql/operations/cvs";

import { cvDetailKey } from "./useCV";

// Импортируем ключ кэша для инвалидации

// Тип в точности повторяет UpdateCvInput из твоей схемы
export type UpdateCvInputData = {
    cvId: string;
    name: string;
    education?: string | null;
    description: string;
};

export function useUpdateCV() {
    const queryClient = useQueryClient();

    return useMutation({
        // mutationFn - это функция, которая делает сам запрос на сервер
        mutationFn: async (cvInput: UpdateCvInputData) => {
            // Оборачиваем наши данные в ключ "cv", как того требует схема
            return gqlClient.request(UPDATE_CV_MUTATION, { cv: cvInput });
        },

        // Эта функция сработает, если сервер ответил без ошибок
        onSuccess: (_, variables) => {
            // variables хранит то, что мы передали в мутацию (включая cvId)
            // Инвалидируем кэш конкретного CV, чтобы useCv заново скачал свежие данные
            queryClient.invalidateQueries({
                queryKey: cvDetailKey(variables.cvId),
            });

            // Если нужно, тут можно инвалидировать и общий список резюме (таблицу),
            // чтобы при возврате назад там тоже были свежие данные.
            // queryClient.invalidateQueries({ queryKey: ["cvs"] });
        },
    });
}

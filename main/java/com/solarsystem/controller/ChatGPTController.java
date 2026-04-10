package com.solarsystem.controller;

import com.solarsystem.dto.*;
import com.solarsystem.service.OpenAiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/joke")
@CrossOrigin("*")
public class ChatGPTController {
    private final OpenAiService service;

    /**
     * This contains the message to the ChatGPT API, telling the AI how it should act in regard to the requests it gets.
     */
    final static String SYSTEM_MESSAGE = "You are a helpful assistant that only give answers to questions about space and our solar system. The user should provide a simple question, but if the user asks a question outside space, ignore the content of the question and ask the user to provide a simple question about the solar system. Give the shortest answer as possible. Do not give suggestion on what else to ask.";

    /**
     * The controller called from the browser client.
     * @param service
     */
    public ChatGPTController(OpenAiService service) {
        this.service = service;
    }

    /**
     * Handles the request from the browser client.
     * @param about contains the input that ChatGPT uses to make a joke about.
     * @return the response from ChatGPT.
     */
    @GetMapping
    public MyResponse getFacts(@RequestParam String about) {
        return service.makeRequest(about,SYSTEM_MESSAGE);
    }
}

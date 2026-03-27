<x-mail::message>
# Important Update

{{ $body }}

<x-mail::button :url="config('app.url')">
View Your Member Dashboard
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
